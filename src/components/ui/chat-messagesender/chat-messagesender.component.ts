import { Component } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'chat-message-sender',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-messagesender.component.html',
  styleUrl: './chat-messagesender.component.css',
})
export class ChatMessagesenderComponent {
  message = '';

  constructor(private userService: UserService) {}
  send() {
    console.log(this.message);
    this.userService.sendMessageToChannel(this.message);
    this.message = '';
  }
}
