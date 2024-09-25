import { Component } from '@angular/core';
import {UserService} from "@services/user/user.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileRoute {

  constructor(protected userService: UserService) {}

}
