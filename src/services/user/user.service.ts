import { computed, effect, Injectable, signal } from '@angular/core';
import { PreferencesService } from '@services/preferences/preferences.service';
import { HttpClient } from '@angular/common/http';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { catchError } from 'rxjs';
import { EventType, Router } from '@angular/router';
import { Group } from '../../../server/src/db/types/group';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  user = computed<any>(() => {
    const jwt = this.preferencesService.jwt();
    if (jwt) {
      const a = jwtDecode(jwt) as JwtPayload;
      const currentTime = Date.now() / 1000;
      const isExpired = a.exp! < currentTime;
      if (isExpired) {
        this.logout();
      } else {
        console.log(a);
        return a;
      }
    } else {
    }
    return undefined;
  });

  // groups = signal<any[]>([]);
  // groupsAll = signal<any[]>([]);

  // selectedGroup = signal({} as { channels?: any[] });
  // selectedChannel = signal(undefined as any);
  // socket;

  constructor(
    private preferencesService: PreferencesService,
    private http: HttpClient,
    private router: Router,
  ) {
    // this.socket = io('http://localhost:3011');
    //
    // this.socket.on('connect', () => {
    //   this.socket.emit('message', {
    //     type: 'user-joined',
    //     data: this.socket.id,
    //   });
    //   console.log(this.socket.id);
    //   console.log('Connected to chat');
    // });
    //
    // this.socket.on('message', ({ type, data }) => {
    //   console.log(type, data);
    // });
    // this.router.events.subscribe((event) => {
    //   if (event.type == EventType.NavigationEnd) {
    //     if (this.router.url !== '/group') {
    //       console.log('SERVER SET NO');
    //       this.server.set(undefined);
    //     }
    //   }
    // });
    // effect(() => {
    //   const user = this.user();
    //   if (user) return this.getGroups();
    //   return [];
    // });
    //
  }

  // getGroups() {
  //   return this.http
  //     .get('http://localhost:3200/api/v1/groups', {
  //       headers: {
  //         Authorization: `Bearer ${this.preferencesService.jwt()}`,
  //       },
  //     })
  //     .pipe(catchError((e) => [e] as any[]))
  //     .subscribe((a) => {
  //       if (a) {
  //         this.groups.set(a);
  //         this.getGroupsAll();
  //       }
  //     });
  // }

  // getGroupsAll() {
  //   this.http
  //     .get('http://localhost:3200/api/v1/groups/all', {})
  //     .pipe(catchError((e) => [e] as any[]))
  //     .subscribe((a) => {
  //       if (a) {
  //         this.groupsAll.set(a);
  //       }
  //     });
  // }

  // async selectServer(server: { name?: string } | undefined) {
  //   if (server == this.server()) {
  //     this.server.set(undefined);
  //     return;
  //   } else {
  //     this.server.set(server);
  //   }
  //
  //   if (this.router.url === '/group') {
  //   } else if (await this.router.navigate(['/group'])) {
  //     this.server.set(server);
  //   } else {
  //     this.router.navigate(['/login']).then(() => {
  //       this.server.set(undefined);
  //     });
  //   }
  // }

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

  refreshJWT() {
    return this.http
      .post(
        'http://localhost:3200/api/v1/user/refresh',
        {},
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .pipe(catchError((err) => err.error))
      .subscribe(async (e: any) => {
        console.log('refreshed JWT');
        console.log(e);
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

  // createGroup() {
  //   return this.http
  //     .post(
  //       'http://localhost:3200/api/v1/groups/create',
  //       { group: { name: 'New Group!' } },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${this.preferencesService.jwt()}`,
  //         },
  //       },
  //     )
  //     .pipe(catchError((err) => err.error))
  //     .subscribe((e: any) => {
  //       console.log(e);
  //       this.getGroups();
  //     });
  // }

  // requestToJoinGroup(group: any) {
  //   this.http
  //     .post(
  //       'http://localhost:3200/api/v1/groups/request',
  //       { group, user: this.user() },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${this.preferencesService.jwt()}`,
  //         },
  //       },
  //     )
  //     .subscribe((e) => {
  //       console.log(e);
  //       this.getGroups();
  //       return e;
  //     });
  // }

  // cancelRequestToJoinGroup(group: any) {
  //   console.log('Cancelling');
  //   this.http
  //     .post(
  //       'http://localhost:3200/api/v1/groups/request/cancel',
  //       { group, user: this.user() },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${this.preferencesService.jwt()}`,
  //         },
  //       },
  //     )
  //     .subscribe((e) => {
  //       console.log(e);
  //       this.getGroups();
  //     });
  //   console.log('Cancelled');
  // }

  // respondToRequestToJoinGroup(group: any, user: any, allow: boolean) {
  //   console.log('Responding');
  //   this.http
  //     .post(
  //       'http://localhost:3200/api/v1/groups/request/respond',
  //       { group, user, allow },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${this.preferencesService.jwt()}`,
  //         },
  //       },
  //     )
  //     .subscribe((e) => {
  //       console.log(e);
  //       this.getGroups();
  //     });
  //   console.log('Cancelled');
  // }

  // sendMessageToChannel(message: string) {
  //   // this.http
  //   //   .post(
  //   //     'http://localhost:3200/api/v1/message/send',
  //   //     {
  //   //       message: {
  //   //         content: message,
  //   //         channel: this.selectedChannel()._id,
  //   //       },
  //   //     },
  //   //     {
  //   //       headers: {
  //   //         Authorization: `Bearer ${this.preferencesService.jwt()}`,
  //   //       },
  //   //     },
  //   //   )
  //   //   .subscribe((e) => {
  //   //     console.log(e);
  //   //     // this.getGroups();
  //   //   });
  //
  //   this.socket.emit('message', {
  //     type: 'new-message',
  //     data: message,
  //   });
  // }

  getChannelmessages(channel: any) {
    return this.http.get('http://localhost:3200/api/v1/channel/messages', {
      headers: {
        Authorization: `Bearer ${this.preferencesService.jwt()}`,
        channel: channel._id,
      },
    });
  }

  uploadProfileImage() {}

  async logout() {
    this.preferencesService.jwt.set('');
    await this.router.navigate(['/login']);
    // this.server.set(undefined);
    // this.groups.set([]);
  }
}
