import { Component } from '@angular/core';
import {TestComponent} from "@components/test/test.component";
import {SidebarMainComponent} from "@components/sidebar/sidebar-main/sidebar-main.component";

@Component({
  selector: 'route-home',
  standalone: true,
  imports: [
    SidebarMainComponent,
    TestComponent,
    SidebarMainComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
  host: {
    class: 'bg-blue-500 col-span-5',
  },
})
export class HomeRoute {

}
