import { Component } from '@angular/core';
import {MatCardModule} from "@angular/material/card";
import {UserService} from "@services/user/user.service";
import {MatIconModule} from "@angular/material/icon";
import {PreferencesService} from "@services/preferences/preferences.service";
import {SidebarServerWidgetComponent} from "@components/sidebar/sidebar-server-widget/sidebar-server-widget.component";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-sidebar-main',
  standalone: true,
  imports: [
    MatCardModule,
    MatIconModule,
    SidebarServerWidgetComponent,
    RouterLink
  ],
  templateUrl: './sidebar-main.component.html',
  styleUrl: './sidebar-main.component.css'
})
export class SidebarMainComponent {
  servers = [
    "Pixel Haven",
    "Galaxy Explorers",
    "Mystic Realm",
    "Quantum Coders",
    "Arcane Society",
    "Cyber Nexus",
    "Astral Voyager",
    "Crystal Haven",
    "Infinity Hangout",
    "Digital Utopia",
    "Nebula Network",
    "Ethereal Citadel",
    "The Nexus Hub",
    "Starlight Lounge",
    "Retro Arcade",
    "The Void Collective",
    "Phantom Squadron",
    "Cloud Nine",
    "The Hive Mind",
    "Lunar Colony",
    "Tech Sanctuary",
    "Cosmic Sanctuary",
    "Alpha Wolves",
    "Serenity Station",
    "Dragon's Den",
    "Future Frontiers",
    "Aether Syndicate",
    "Galactic Council",
    "Pixel Paradise",
    "Virtual Fortress",
    "Sapphire Domain",
    "Chrono Club",
    "Astral Assembly",
    "Dream Weaver",
    "The Binary Zone",
    "Enigma Society",
    "Celestial Camp",
    "Cosmic Harmony",
    "Hyperion Station",
    "The Expanse",
    "Cyber Oasis",
    "Digital Dynasty",
    "Phoenix Rising",
    "Echo Chamber",
    "Quantum Lounge",
  ]

  selected : undefined | {name?:string}
  constructor(
    protected userService: UserService,
    protected preferencesService: PreferencesService
  ) {
    this.selected = userService.server();
    this.preferencesService.setKeys({sidebar_folded: true});
  }

  log(){
    console.log("hi");
    this.preferencesService.getKeys(['sidebar_folded'])
  }
}
