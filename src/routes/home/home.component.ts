import { Component } from '@angular/core';
import {SidebarMainComponent} from "@components/@sidebar/sidebar-main/sidebar-main.component";

@Component({
  selector: 'route-home',
  standalone: true,
  imports: [
    SidebarMainComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeRoute {

}
