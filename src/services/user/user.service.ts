import {computed, Injectable, signal} from '@angular/core';
import {PreferencesService} from "@services/preferences/preferences.service";
import {HttpClient} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";
import {catchError} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  server = signal('');

  user = computed<any>(() => {
      const jwt = this.preferencesService.jwt()
      if (jwt) {
        return jwtDecode(jwt)
      }
      return undefined
    }
  )

  constructor(
    private preferencesService: PreferencesService,
    private http: HttpClient
  ) {
  }

  selectServer(server: string) {
    this.server.set(server)
  }

  //username: string, password: string
  login(username: string, password: string) {
    return this.http.post('http://localhost:3200/api/v1/user/login',
      {user: {username, password}},
    ).pipe(catchError(err => err.error)).subscribe((e: any) => {
      this.preferencesService.jwt.set(e.jwt)
      console.log(this.user())
    })
  }

  register(username: string, email: string, password: string) {
    return this.http.post('http://localhost:3200/api/v1/user/register',
      {user: {username, email, password}},
    )
  }

  logout(){
    this.preferencesService.jwt.set('');
  }
}
