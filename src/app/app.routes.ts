import { Routes } from '@angular/router';
import {HomeRoute} from "@routes/home/home.component";
import {LoginRoute} from "@routes/login/login.component";
import {ProfileRoute} from "@routes/profile/profile.component";
import {loggedInGuard, notLoggedInGuard} from "../guards/canActivate/logged-in.guard";
import {GroupRoute} from "@routes/group/group.component";
import {groupSelectedGuard} from "../guards/canActivate/group-selected.guard";

export const routes: Routes = [
  {
    path: 'test',
    component: HomeRoute,
  },

  {
    path: 'login',
    component: LoginRoute,
    canActivate: [notLoggedInGuard],
  },

  {
    path: 'profile',
    component: ProfileRoute,
    canActivate: [loggedInGuard],
  },

  {
    path: 'group',
    component: GroupRoute,
    canActivate: [loggedInGuard, groupSelectedGuard],
  },
];
