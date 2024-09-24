import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [MatSlideToggleModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrl: './test.component.css',
})
export class TestComponent {
  isChecked = false;
  onChange() {
    console.log(this.isChecked);
  }
}
