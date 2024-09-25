import { Component } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { JsonPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { GroupAdminPanelComponent } from '@components/profile/group-admin-panel/group-admin-panel.component';
import { GroupJoinRequesterComponent } from '@components/profile/group-join-requester/group-join-requester.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    JsonPipe,
    MatCardModule,
    GroupAdminPanelComponent,
    GroupJoinRequesterComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
  host: {
    class: 'w-full flex',
  },
})
export class ProfileRoute {
  constructor(protected userService: UserService) {}

  protected readonly Array = Array;
}
