import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { UserService } from '@services/user/user.service';
import { MatIconModule } from '@angular/material/icon';
import { PreferencesService } from '@services/preferences/preferences.service';
import { SidebarServerWidgetComponent } from '@components/sidebar/sidebar-server-widget/sidebar-server-widget.component';
import { RouterLink } from '@angular/router';
import { GroupService } from '@services/group/group.service';
import { ChatService } from '@services/chat/chat.service';

@Component({
  selector: 'app-sidebar-main',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    SidebarServerWidgetComponent,
    RouterLink,
  ],
  templateUrl: './sidebar-main.component.html',
  styleUrl: './sidebar-main.component.css',
})
export class SidebarMainComponent {
  selected: undefined | { name?: string };
  constructor(
    protected userService: UserService,
    protected chatService: ChatService,
    protected preferencesService: PreferencesService,
  ) {
    this.selected = chatService.selectedServer();
    this.preferencesService.setKeys({ sidebar_folded: true });
  }

  log() {
    console.log('hi');
    this.preferencesService.getKeys(['sidebar_folded']);
  }
}
