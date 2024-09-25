import {CanActivateFn} from '@angular/router';
import {UserService} from "@services/user/user.service";
import {inject} from "@angular/core";

export const groupSelectedGuard: CanActivateFn = (route, state) => {
  return !!inject(UserService).server();
};
