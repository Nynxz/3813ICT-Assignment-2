import { Routes } from '@angular/router';
import {HomeRoute} from "@routes/home/home.component";
import {LoginRoute} from "@routes/login/login.component";

export const routes: Routes = [
  {
    path: 'test',
    component: HomeRoute,
  },

  {
    path: 'login',
    component: LoginRoute,
  },
];
