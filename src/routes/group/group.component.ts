import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  computed,
  effect,
  ElementRef,
  OnChanges,
  signal,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { UserService } from '@services/user/user.service';
import { JsonPipe, NgIf } from '@angular/common';
import { ChatMessagesenderComponent } from '@components/ui/chat-messagesender/chat-messagesender.component';
import { ChatService } from '@services/chat/chat.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { PreferencesService } from '@services/preferences/preferences.service';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [JsonPipe, ChatMessagesenderComponent, FormsModule, NgIf],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
  host: {
    class: 'w-full h-full  overflow-hidden flex flex-grow  ',
  },
})
export class GroupRoute {
  lastCall = undefined as any;
  gettingCalled = signal('');
  inCall = false;

  onSettings = false;
  onCall = false;

  enlargedImage: string | null = null;

  selectedChannel = undefined as any;
  selectedChannelS = signal(undefined as any);

  settings_serverName = '';

  settings_renameChannel = '';
  settings_renameChannelID = '';

  callYouStream = signal(undefined as any);
  callThemStream = signal(undefined as any);

  constructor(protected chatService: ChatService) {
    effect(() => {
      console.log('Update');
      const sChannel = this.chatService.selectedChannel();
      if (sChannel) {
        this.chatService.get_channel_messages();
      }
    });

    this.settings_serverName = chatService.selectedServer()?.name!;

    navigator.mediaDevices
      .getUserMedia({
        video: true,
      })
      .then((stream) => {
        this.callYouStream.set(stream);

        this.chatService.peer?.on('call', (call) => {
          // Connection established, now you can send data
          console.log('Answering Call!');

          this.gettingCalled.set(
            this.chatService
              .selectedServer()!
              .users!.find((e) => e._id == call.peer)?.username!,
          );
          this.lastCall = call;

          call.on('stream', (stream) => {
            console.log('Getting other stream?');
            this.inCall = true;
            this.lastCall = call;
            this.callThemStream.set(stream);
          });

          call.on('close', () => {
            console.log('Closing Call');
            this.inCall = false;
            this.callThemStream.set(undefined);
            call.close();
            this.hangUp();
          });
        });
      });
  }

  hangUp() {
    console.log(this.lastCall);
    this.lastCall.close();
    this.inCall = false;
    this.gettingCalled.set('');
  }

  async answerCall() {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    this.lastCall.answer(stream);
    this.gettingCalled.set('');
    this.inCall = true;
  }

  async goToCall() {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    this.callYouStream.set(mediaStream);

    this.onSettings = false;
    this.onCall = !this.onCall;
  }

  async callUser(peer: string) {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    this.callYouStream.set(mediaStream);

    const conn = this.chatService.peer?.call(peer, mediaStream);

    this.chatService.peer?.on('call', (call) => {
      // Connection established, now you can send data
      console.log('Answering Call!');
      this.lastCall = call;
      call.answer(mediaStream);
    });

    conn.on('stream', (stream) => {
      console.log('Getting other stream?');
      this.lastCall = conn;
      this.inCall = true;
      this.callThemStream.set(stream);
    });

    conn.on('close', () => {
      console.log('Closing Call');
      this.inCall = false;
      this.callThemStream.set(undefined);
      conn.close();
      this.hangUp();
      conn.off('stream');
      conn.off('close');
    });
  }

  goToSettings() {
    this.onSettings = !this.onSettings;
    this.onCall = false;
  }

  selectChannel(channel: any) {
    this.onCall = false;
    this.onSettings = false;
    console.log('Selecting');
    this.chatService.selectedChannel.set(undefined);
    this.chatService.selectedChannel.set(channel);
  }

  createChannel() {
    this.chatService.create_new_channel();
  }

  enlargeImage(image: string) {
    this.enlargedImage = image;
  }

  closeImage() {
    this.enlargedImage = null;
  }

  renameServer() {
    console.log(this.settings_serverName);
    this.chatService.rename_group(this.settings_serverName);
  }

  renameChannel() {
    console.log(this.settings_renameChannel);
    this.chatService.rename_channel(
      this.settings_renameChannel,
      this.settings_renameChannelID,
    );
  }

  arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1,
    2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8,
  ];
}
