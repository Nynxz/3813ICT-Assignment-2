import { computed, effect, Injectable, signal } from '@angular/core';
import { PreferencesService } from '@services/preferences/preferences.service';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { catchError } from 'rxjs';
import { EventType, Router } from '@angular/router';
import { Group } from '../../../server/src/db/types/group';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  server = signal<{ name?: string } | undefined>({});

  user = computed<any>(() => {
    const jwt = this.preferencesService.jwt();
    if (jwt) {
      return jwtDecode(jwt);
    }
    return undefined;
  });

  groups = signal<any[]>([]);
  groupsAll = signal<any[]>([]);

  constructor(
    private preferencesService: PreferencesService,
    private http: HttpClient,
    private router: Router,
  ) {
    this.router.events.subscribe((event) => {
      if (event.type == EventType.NavigationEnd) {
        if (this.router.url !== '/group') {
          console.log('SERVER SET NO');
          this.server.set(undefined);
        }
      }
    });

    effect(() => {
      const user = this.user();
      if (user) return this.getGroups();
      return [];
    });
  }

  getGroups() {
    return this.http
      .get('http://localhost:3200/api/v1/groups', {
        headers: {
          Authorization: `Bearer ${this.preferencesService.jwt()}`,
        },
      })
      .pipe(catchError((e) => [e] as any[]))
      .subscribe((a) => {
        if (a) {
          this.groups.set(a);
          this.getGroupsAll();
        }
      });
  }

  getGroupsAll() {
    this.http
      .get('http://localhost:3200/api/v1/groups/all', {})
      .pipe(catchError((e) => [e] as any[]))
      .subscribe((a) => {
        if (a) {
          this.groupsAll.set(a);
        }
      });
  }

  async selectServer(server: { name?: string } | undefined) {
    if (server == this.server()) {
      this.server.set(undefined);
      return;
    } else {
      this.server.set(server);
    }

    if (this.router.url === '/group') {
    } else if (await this.router.navigate(['/group'])) {
      this.server.set(server);
    } else {
      this.router.navigate(['/login']).then(() => {
        this.server.set(undefined);
      });
    }
  }

  login(username: string, password: string) {
    return this.http
      .post('http://localhost:3200/api/v1/user/login', {
        user: { username, password },
      })
      .pipe(catchError((err) => err.error))
      .subscribe(async (e: any) => {
        this.preferencesService.jwt.set(e.jwt);
        console.log(this.user());
        await this.router.navigate(['/profile']);
        return true;
      });
  }

  register(username: string, email: string, password: string) {
    return this.http
      .post('http://localhost:3200/api/v1/user/register', {
        user: { username, email, password },
      })
      .pipe(catchError((err) => err.error))
      .subscribe((e: any) => {
        console.log('RES');
        console.log(e);
      });
  }

  createGroup() {
    return this.http
      .post(
        'http://localhost:3200/api/v1/groups/create',
        { group: { name: 'New Group!' } },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .pipe(catchError((err) => err.error))
      .subscribe((e: any) => {
        console.log(e);
        this.getGroups();
      });
  }

  requestToJoinGroup(group: any) {
    this.http
      .post(
        'http://localhost:3200/api/v1/groups/request',
        { group, user: this.user() },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((e) => {
        console.log(e);
        this.getGroups();
        return e;
      });
  }

  cancelRequestToJoinGroup(group: any) {
    console.log('Cancelling');
    this.http
      .post(
        'http://localhost:3200/api/v1/groups/request/cancel',
        { group, user: this.user() },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((e) => {
        console.log(e);
        this.getGroups();
      });
    console.log('Cancelled');
  }

  respondToRequestToJoinGroup(group: any, user: any, allow: boolean) {
    console.log('Responding');
    this.http
      .post(
        'http://localhost:3200/api/v1/groups/request/respond',
        { group, user, allow },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((e) => {
        console.log(e);
        this.getGroups();
      });
    console.log('Cancelled');
  }

  async logout() {
    this.preferencesService.jwt.set('');
    await this.router.navigate(['/login']);
    this.server.set(undefined);
    this.groups.set([]);
  }
}
