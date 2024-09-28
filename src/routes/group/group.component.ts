import { Component } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
})
export class GroupRoute {
  constructor(protected userService: UserService) {}
}
