import { CanActivateFn } from '@angular/router';
import { UserService } from '@services/user/user.service';
import { inject } from '@angular/core';
import { ChatService } from '@services/chat/chat.service';

export const groupSelectedGuard: CanActivateFn = (route, state) => {
  return !!inject(ChatService).selectedServer();
};
