import {
  Component,
  computed,
  effect,
  OnChanges,
  signal,
  SimpleChanges,
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
  constructor(
    protected userService: UserService,
    protected chatService: ChatService,
    private preferencesService: PreferencesService,
    private http: HttpClient,
  ) {
    effect(() => {
      console.log('Update');
      const sChannel = this.chatService.selectedChannel();
      if (sChannel) {
        this.chatService.get_channel_messages();
      }
    });
  }

  selectedFile: File | null = null;

  enlargedImage: string | null = null;

  selectedChannel = undefined as any;
  selectedChannelS = signal(undefined as any);
  // chats = signal([] as any);
  // chats = computed(() => {
  //   const sChannel = this.userService.selectedChannel();
  //   const m = this.userService.getChannelmessages(sChannel).subscribe(messages => {
  //
  //   });
  //   if (sChannel) {
  //     return this.arr.map((e) => sChannel.name + e ?? '');
  //   }
  //   return [];
  // });

  selectChannel(channel: any) {
    console.log('Selecting');
    this.chatService.selectedChannel.set(undefined);
    this.chatService.selectedChannel.set(channel);
  }

  enlargeImage(image: string) {
    this.enlargedImage = image;
  }

  closeImage() {
    this.enlargedImage = null;
  }

  uploadImage() {
    console.log('Uploading');
    if (!this.selectedFile) {
      return; // No file selected, handle this case as needed
    }

    const formData = new FormData();
    formData.append('image', this.selectedFile, this.selectedFile.name);
    this.http
      .post(
        'http://localhost:3200/api/v1/user/updateprofilepicture',
        formData,
        {
          headers: {
            Authorization: `Bearer ${this.preferencesService.jwt()}`,
          },
        },
      )
      .subscribe((response) => {
        console.log('Upload successful!', response);
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }

  arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1,
    2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8,
  ];
}
