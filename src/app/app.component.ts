import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {TestComponent} from "@components/test/test.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = '3813ICT-assignment-2';
}
