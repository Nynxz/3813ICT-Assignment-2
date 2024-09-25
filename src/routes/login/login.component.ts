import { Component } from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule} from "@angular/forms";
import {UserService} from "@services/user/user.service";
import {Validators} from '@angular/forms';
import {catchError} from "rxjs";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSlideToggleModule,
    FormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  host: {
    class: 'w-full',
  }
})
export class LoginRoute {

  registering = false;

  loginForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', this.registering ? Validators.required : undefined),
    password: new FormControl('', Validators.required),
  });

  error = "";


  constructor(protected userService: UserService) {
  }

  handleSubmit() {
    if(!this.loginForm.valid){
      this.error = "Username and Password Required";
    } else {
      if(!this.registering){
        this.userService.login(this.loginForm.value.username || '', this.loginForm.value.password || '')
      } else {
        this.userService.register(this.loginForm.value.username || '', this.loginForm.value.email || '',this.loginForm.value.password || '').pipe(catchError(err => this.error = err.error)).subscribe((e: any) => {
          console.log("RES")
          console.log(e);
        })
      }
    }
  }
}
