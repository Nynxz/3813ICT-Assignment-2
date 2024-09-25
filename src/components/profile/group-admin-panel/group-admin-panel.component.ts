import { Component, signal } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { MatCardModule } from '@angular/material/card';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'profile-group-admin-panel',
  standalone: true,
  imports: [MatCardModule, JsonPipe],
  templateUrl: './group-admin-panel.component.html',
  styleUrl: './group-admin-panel.component.css',
})
export class GroupAdminPanelComponent {
  selectedServer = signal(undefined as any);

  constructor(protected userService: UserService) {}
  protected readonly JSON = JSON;
  protected readonly Array = Array;
  protected readonly console = console;
}
