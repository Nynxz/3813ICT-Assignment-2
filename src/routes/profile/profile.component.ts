import { Component, effect, signal } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GroupAdminPanelComponent } from '@components/profile/group-admin-panel/group-admin-panel.component';
import { GroupJoinRequesterComponent } from '@components/profile/group-join-requester/group-join-requester.component';
import { ChatService } from '@services/chat/chat.service';
import { PreferencesService } from '@services/preferences/preferences.service';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    JsonPipe,
    MatCardModule,
    GroupAdminPanelComponent,
    GroupJoinRequesterComponent,
    FormsModule,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  host: {
    class: 'w-full flex',
  },
})
export class ProfileRoute {
  protected readonly Array = Array;
  constructor(
    protected userService: UserService,
    protected chatService: ChatService,
    private preferencesService: PreferencesService,
    private http: HttpClient,
  ) {}

  selectedFile: File | null = null;

  enlargedImage: string | null = null;

  selectedChannel = undefined as any;
  selectedChannelS = signal(undefined as any);

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
          responseType: 'text', // Specify response type as text
        },
      )
      .subscribe((response) => {
        this.userService.refreshJWT();
        console.log('Upload successful!', response);
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
    }
  }
}
