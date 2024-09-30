import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from '@services/user/user.service';
import { PreferencesService } from '@services/preferences/preferences.service';
import { ChatService } from '@services/chat/chat.service';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  constructor(
    private http: HttpClient,
    private preferencesService: PreferencesService,
    private userService: UserService,
    private chatService: ChatService,
  ) {}

  post_create_group() {
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
        this.chatService.get_groups_user();
      });
  }

  post_request_join_cancel(group: any) {
    console.log('Cancelling');
    this.http
      .post(
        'http://localhost:3200/api/v1/groups/request/cancel',
        { group, user: this.userService.user() },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((e) => {
        console.log(e);
        this.chatService.get_groups_user();
      });
    console.log('Cancelled');
  }
  post_request_join_create(group: any) {
    this.http
      .post(
        'http://localhost:3200/api/v1/groups/request',
        { group, user: this.userService.user() },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((e) => {
        console.log(e);
        this.chatService.get_groups_user();
        return e;
      });
  }

  post_response_joinRequest(group: any, user: any, allow: boolean) {
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
        this.chatService.get_groups_user();
      });
    console.log('Cancelled');
  }
}
