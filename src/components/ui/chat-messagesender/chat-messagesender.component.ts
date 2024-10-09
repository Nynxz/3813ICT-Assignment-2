import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatService } from '@services/chat/chat.service';
import { HttpClient } from '@angular/common/http';
import { PreferencesService } from '@services/preferences/preferences.service';

@Component({
  selector: 'chat-message-sender',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-messagesender.component.html',
  styleUrl: './chat-messagesender.component.css',
  host: {
    class: 'w-full',
  },
})
export class ChatMessagesenderComponent {
  message = '';
  selectedFiles: FileList | null = null;
  @ViewChild('imageInput') imageInput!: ElementRef;

  constructor(
    private chatService: ChatService,
    private preferencesService: PreferencesService,
    private http: HttpClient,
  ) {}
  sendX() {
    console.log(this.message);

    // this.chatService.post_message_channel(this.message);
    this.message = '';
  }

  send() {
    console.log('Uploading');
    let formData = undefined;
    formData = new FormData();
    formData.append('message', this.message);
    if (this.selectedFiles) {
      for (let i = 0; i < this.selectedFiles.length; i++) {
        formData.append(
          'images',
          this.selectedFiles[i],
          this.selectedFiles[i].name,
        );
      }
    }

    this.chatService.post_message_channel(formData);
    this.message = '';
    this.selectedFiles = null;
    this.imageInput.nativeElement.value = '';

    // this.http
    //   .post(
    //     'http://localhost:3200/api/v1/user/updateprofilepicture',
    //     formData,
    //     {
    //       headers: {
    //         Authorization: `Bearer ${this.preferencesService.jwt()}`,
    //       },
    //     },
    //   )
    //   .subscribe((response) => {
    //     console.log('Upload successful!', response);
    //   });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      console.log(input.files);
      this.selectedFiles = input.files;
    }
  }
}
