import { effect, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { PreferencesService } from '@services/preferences/preferences.service';
import { UserService } from '@services/user/user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  allGroups = signal([] as any[]);
  userGroups = signal(undefined);
  selectedServer = signal(undefined);
  selectedGroup = signal(undefined);
  selectedChannel = signal(undefined);

  constructor(
    private http: HttpClient,
    private preferencesService: PreferencesService,
    private userService: UserService,
  ) {
    // Update groups when new user is selected
    effect(() => {
      const user = this.userService.user();
      if (user) return this.get_groups_user();
      return [];
    });
  }

  select_server() {}

  get_groups_all() {
    this.http
      .get('http://localhost:3200/api/v1/groups/all', {})
      .pipe(catchError((e) => [e] as any[]))
      .subscribe((a) => {
        if (a) {
          this.allGroups.set(a);
        }
      });
  }

  get_groups_user() {
    return this.http
      .get('http://localhost:3200/api/v1/groups', {
        headers: {
          Authorization: `Bearer ${this.preferencesService.jwt()}`,
        },
      })
      .pipe(catchError((e) => [e] as any[]))
      .subscribe((a) => {
        if (a) {
          this.userGroups.set(a);
          this.get_groups_all();
        }
      });
  }

  post_message_channel(message: string) {}
  get_channel_messages(channel: any) {}
}
