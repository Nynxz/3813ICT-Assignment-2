import { effect, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { PreferencesService } from '@services/preferences/preferences.service';
import { UserService } from '@services/user/user.service';
import { EventType, Router } from '@angular/router';
import { io } from 'socket.io-client';
import { Peer } from 'peerjs';
import { resolve } from '@angular/compiler-cli';

type Channel = {
  channels?: any[];
};

type User = {
  _id: string;
  username: string;
};

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  allGroups = signal([] as any[]);
  userGroups = signal([] as any[]);

  selectedServer = signal<
    { name: string; _id?: string; users: User[] } | undefined
  >(undefined);
  selectedGroup = signal<Channel>({});
  selectedChannel = signal(undefined as any);
  selectedChannelMessages = signal([] as any);
  socket;
  peer;

  constructor(
    private http: HttpClient,
    private preferencesService: PreferencesService,
    private userService: UserService,
    private router: Router,
  ) {
    this.peer = new Peer(this.userService.user()._id);
    console.log('Starting PeerJS...');
    console.log(this.peer.id);
    this.peer.on('open', function (id) {
      console.log('My peer ID is: ' + id);
    });

    // navigator.mediaDevices
    //   .getUserMedia({
    //     audio: true,
    //   })
    //   .then((mediaStream) => {
    //     this.peer?.on('call', (call) => {
    //       // Connection established, now you can send data
    //       console.log('Answering Call!');
    //       call.answer(mediaStream);
    //       this.hmm = mediaStream;
    //     });
    //   });

    this.peer.on('connection', (conn) => {
      console.log('Connection?');
      conn.send('Hello!');
      conn.on('data', (data: any) => {
        console.log('Received: ', data);
      });
    });

    this.socket = io('http://localhost:3011');

    this.socket.on('connect', () => {
      this.socket?.emit('message', {
        type: 'user-joined',
        data: this.socket.id,
      });
      console.log(this.socket?.id);
      console.log('Connected to chat');
    });

    this.socket.on('message', ({ type, data }) => {
      // console.log(type, data);
      if (type == 'new-message') {
        console.log('GOT NEW SOCKET MESSAGE');
        const p = JSON.parse(data);
        console.log(type, p);
        if (p.channel == this.selectedChannel()._id) {
          const n = {
            channel: p.channel,
            content: p.content,
            sender: p.sender,
            images: p.images,
          };
          this.selectedChannelMessages.update((b) => [...b, n]);
          console.log(this.selectedChannelMessages());
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
          console.log('No server');
          this.selectedGroup.set({});
          this.selectedChannelMessages.set(undefined);
        }
      },
      { allowSignalWrites: true },
    );
  }

  lastPeer = undefined as any;

  sendNewDataToPeer() {
    if (this.lastPeer) {
      this.lastPeer.send('New Data!');
    }
  }

  connectToPeer(peerId: string) {
    const conn = this.peer?.connect(peerId);
    conn?.on('open', () => {
      // Connection established, now you can send data
      this.lastPeer = conn;
      this.lastPeer.id = peerId;

      console.log('Connection established with peer:', peerId);
      conn.send('Hello from ' + this.peer?.id); // Send a message to the connected peer
    });

    conn?.on('data', (data: any) => {
      console.log('Received from peer:', data); // Listen for incoming data
    });

    conn?.on('close', () => {
      console.log('Connection closed with peer:', peerId);
    });

    conn?.on('error', (err) => {
      console.log('Error in connection:', err);
    });
  }

  // async callPeer(peerId: string): Promise<MediaStream> {
  // const mediaStream = await navigator.mediaDevices.getUserMedia({
  //   video: true,
  // });
  // return new Promise((resolve, reject) => {
  //   const conn = this.peer?.call(peerId, mediaStream);
  //
  //   conn?.on('stream', function (stream) {
  //     // `stream` is the MediaStream of the remote peer.
  //     // Here you'd add it to an HTML video/canvas element.
  //     console.log('Stream?');
  //     resolve(stream);
  //   });
  //
  //   conn?.on('close', () => {
  //     console.log('Connection closed with peer:', peerId);
  //   });
  //
  //   conn?.on('error', (err) => {
  //     console.log('Error in connection:', err);
  //     reject(err);
  //   });
  // });
  // }

  async select_server(server: { name: string; users: User[] } | undefined) {
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

  rename_group(name: string) {
    this.http
      .post(
        this.preferencesService.apiURL + 'groups/update',
        {
          group: { name, _id: this.selectedServer()?._id },
        },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((a) => {
        if (a) {
          this.get_groups_all();
          this.get_groups_user();
        }
      });
  }

  rename_channel(name: string, id: string) {
    console.log(this.userGroups());

    this.http
      .post(
        this.preferencesService.apiURL + 'channel/update',
        {
          channel: { name, _id: id },
        },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe(async (a: any) => {
        console.log(this.userGroups());

        this.get_groups_all();
        this.get_groups_user();
        const current = this.selectedServer();
        await this.select_server(undefined);
        await this.select_server(current);
      });
  }

  create_new_channel() {
    this.http
      .post(
        this.preferencesService.apiURL + 'channel/create',
        {
          group: this.selectedGroup(),
        },
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((a) => {
        if (a) {
          this.get_groups_all();
          this.get_groups_user();
          this.selectedServer.set(a as any);
        }
      });
  }

  get_groups_all() {
    this.http
      .get(this.preferencesService.apiURL + 'groups/all', {})
      .pipe(catchError((e) => [e] as any[]))
      .subscribe((a) => {
        if (a) {
          this.allGroups.set(a);
        }
      });
  }

  get_groups_user() {
    return this.http
      .get(this.preferencesService.apiURL + 'groups', {
        headers: {
          Authorization: `Bearer ${this.preferencesService.jwt()}`,
        },
      })
      .pipe(catchError((e) => [e] as any[]))
      .subscribe((a) => {
        if (a) {
          console.log('GOT GROUPS');
          console.log(a);
          this.userGroups.set(a);
          this.get_groups_all();
        }
      });
  }

  post_message_channel(formData: FormData) {
    formData.append('channel', this.selectedChannel()._id);
    this.http
      .post(this.preferencesService.apiURL + 'message/send', formData, {
        headers: {
          Authorization: `Bearer ${this.preferencesService.jwt()}`,
        },
      })
      .subscribe((e) => {
        // console.log(e);
        // this.get_groups_all();
        // this.get_channel_messages();
      });

    // this.socket.emit('message', {
    //   type: 'new-message',
    //   data: JSON.stringify({
    //     content: formData.get('message'),
    //     channel: this.selectedChannel()._id,
    //     user: this.userService.user(),
    //   }),
    // });
  }
  get_channel_messages() {
    this.http
      .get(this.preferencesService.apiURL + 'channel/messages', {
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
