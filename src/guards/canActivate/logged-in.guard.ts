import {CanActivateFn, Router} from '@angular/router';
import {UserService} from "@services/user/user.service";
import {inject} from "@angular/core";

export const loggedInGuard: CanActivateFn = (route, state) => {
  return !!inject(UserService).user();
};


export const notLoggedInGuard: CanActivateFn = (route, state) => {
  if (!!inject(UserService).user()){
    inject(Router).navigate(['/profile'])
    return false;
  } else {
    return true;
  }
};
