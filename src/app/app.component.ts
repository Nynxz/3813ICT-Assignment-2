import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TestComponent} from "@components/test/test.component";
import {SidebarMainComponent} from "@components/sidebar/sidebar-main/sidebar-main.component";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatIconButton} from "@angular/material/button";
import {MatCardModule} from "@angular/material/card";
import {UserService} from "@services/user/user.service";
import {PreferencesService} from "@services/preferences/preferences.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestComponent, SidebarMainComponent, MatSidenavModule, MatListModule, MatIconModule, MatIconButton, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = '3813ICT-assignment-2';

  selected = ''
  constructor(protected preferencesService: PreferencesService) {

  }
}
