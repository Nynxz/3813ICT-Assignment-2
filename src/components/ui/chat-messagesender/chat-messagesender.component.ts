import { Component } from '@angular/core';
import { UserService } from '@services/user/user.service';
import { FormsModule } from '@angular/forms';
import { GroupService } from '@services/group/group.service';
import { ChatService } from '@services/chat/chat.service';

@Component({
  selector: 'chat-message-sender',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat-messagesender.component.html',
  styleUrl: './chat-messagesender.component.css',
  host: {
    class: 'w-full',
  },
})
export class ChatMessagesenderComponent {
  message = '';

  constructor(private chatService: ChatService) {}
  send() {
    console.log(this.message);
    this.chatService.post_message_channel(this.message);
    this.message = '';
  }
}
