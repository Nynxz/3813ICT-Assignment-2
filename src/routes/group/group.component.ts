import {
  Component,
  computed,
  effect,
  OnChanges,
  signal,
  SimpleChanges,
} from '@angular/core';
import { UserService } from '@services/user/user.service';
import { JsonPipe } from '@angular/common';
import { ChatMessagesenderComponent } from '@components/ui/chat-messagesender/chat-messagesender.component';

@Component({
  selector: 'app-group',
  standalone: true,
  imports: [JsonPipe, ChatMessagesenderComponent],
  templateUrl: './group.component.html',
  styleUrl: './group.component.css',
  host: {
    class: 'w-full h-full  overflow-hidden flex flex-grow  ',
  },
})
export class GroupRoute {
  constructor(protected userService: UserService) {
    effect(() => {
      const sChannel = this.userService.selectedChannel();
      if (sChannel) {
        const m = this.userService
          .getChannelmessages(sChannel)
          .subscribe((messages) => {
            console.log('Got new chat');
            this.chats.set(messages);
          });
      }
    });
  }

  selectedChannel = undefined as any;
  selectedChannelS = signal(undefined as any);
  chats = signal([] as any);
  // chats = computed(() => {
  //   const sChannel = this.userService.selectedChannel();
  //   const m = this.userService.getChannelmessages(sChannel).subscribe(messages => {
  //
  //   });
  //   if (sChannel) {
  //     return this.arr.map((e) => sChannel.name + e ?? '');
  //   }
  //   return [];
  // });

  selectChannel(channel: any) {
    console.log('Selecting');
    this.userService.selectedChannel.set(channel);
  }

  arr = [
    1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1,
    2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8,
  ];
}
