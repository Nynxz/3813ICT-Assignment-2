import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-server-widget',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-server-widget.component.html',
  styleUrl: './sidebar-server-widget.component.css'
})
export class SidebarServerWidgetComponent {
  @Input() server: { name?: string } = {};
  @Input() selected: boolean = false;
  @Input() folded: boolean | null = false;

  @Output() clicked = new EventEmitter();

  doClicked() {
    this.clicked.emit(this.server);
    console.log(this.server)
  }
}
