import { effect, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { PreferencesService } from '@services/preferences/preferences.service';
import { UserService } from '@services/user/user.service';
import { EventType, Router } from '@angular/router';
import { io } from 'socket.io-client';

type Channel = {
  channels?: any[];
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  allGroups = signal([] as any[]);
  userGroups = signal([] as any[]);

  selectedServer = signal<{ name?: string; _id?: string } | undefined>(
    undefined,
  );
  selectedGroup = signal<Channel>({});
  selectedChannel = signal(undefined as any);
  selectedChannelMessages = signal([] as any);
  socket;

  constructor(
    private http: HttpClient,
    private preferencesService: PreferencesService,
    private userService: UserService,
    private router: Router,
  ) {
    this.socket = io('http://localhost:3011');

    this.socket.on('connect', () => {
      this.socket.emit('message', {
        type: 'user-joined',
        data: this.socket.id,
      });
      console.log(this.socket.id);
      console.log('Connected to chat');
    });

    this.socket.on('message', ({ type, data }) => {
      console.log(type, data);
      if (type == 'new-message') {
        const p = JSON.parse(data);
        if (p.channel == this.selectedChannel()._id) {
          const n = {
            channel: p.channel,
            content: p.content,
            sender: p.user,
          };
          this.selectedChannelMessages.update((b) => [...b, n]);
        }
      }
    });

    // Update groups when new user is selected
    effect(() => {
      const user = this.userService.user();
      if (user) return this.get_groups_user();
      return [];
    });

    this.router.events.subscribe((event) => {
      if (event.type == EventType.NavigationEnd) {
        if (this.router.url !== '/group') {
          console.log('SERVER SET NO');
          this.selectedServer.set(undefined);
        }
      }
    });

    effect(
      () => {
        const server = this.selectedServer();
        if (server != undefined) {
          this.http
            .get('http://localhost:3200/api/v1/groups/info', {
              headers: {
                group: server._id!,
                Authorization: `Bearer ${this.preferencesService.jwt()}`,
              },
            })
            .pipe(catchError((e) => [e] as any[]))
            .subscribe((a) => {
              if (a) {
                this.selectedGroup.set(a);
                this.selectedChannel.set(undefined);
                this.selectedChannelMessages.set(undefined);
              }
            });
        } else {
          this.selectedGroup.set({});
        }
      },
      { allowSignalWrites: true },
    );
  }

  async select_server(server: { name?: string } | undefined) {
    if (server == this.selectedServer()) {
      this.selectedServer.set(undefined);
      return;
    } else {
      this.selectedServer.set(server);
    }

    if (this.router.url === '/group') {
    } else if (await this.router.navigate(['/group'])) {
      this.selectedServer.set(server);
    } else {
      this.router.navigate(['/login']).then(() => {
        this.selectedServer.set(undefined);
      });
    }
  }

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

  post_message_channel(message: string) {
    this.http
      .post(
        'http://localhost:3200/api/v1/message/send',
        {
          message: {
            content: message,
            channel: this.selectedChannel()._id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((e) => {
        console.log(e);
        this.get_groups_all();
        this.get_channel_messages();
      });

    this.socket.emit('message', {
      type: 'new-message',
      data: JSON.stringify({
        content: message,
        channel: this.selectedChannel()._id,
        user: this.userService.user(),
      }),
    });
  }
  get_channel_messages() {
    this.http
      .get('http://localhost:3200/api/v1/channel/messages', {
        headers: {
          Authorization: `Bearer ${this.preferencesService.jwt()}`,
          channel: this.selectedChannel()._id,
        },
      })
      .subscribe((e) => {
        console.log(e);
        this.selectedChannelMessages.set(e);
        this.get_groups_all();
      });
  }
}
