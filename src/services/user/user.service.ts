import {computed, Injectable, OnChanges, signal, SimpleChanges} from '@angular/core';
import {PreferencesService} from "@services/preferences/preferences.service";
import {HttpClient} from "@angular/common/http";
import {jwtDecode} from "jwt-decode";
import {catchError} from "rxjs";
import {EventType, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserService implements OnChanges {

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
    private http: HttpClient,
    private router: Router
  ) {
    this.router.events.subscribe((event) => {
      if(event.type == EventType.NavigationEnd){
        if(this.router.url !== '/group'){
          console.log("SERVER SET NO")
          this.server.set('');
        }
      }
    })
  }

  async selectServer(server: string) {
    if(server == this.server()){
      this.server.set('');
      return;
    } else {
      this.server.set(server);
    }

    if(this.router.url === '/group'){

    } else if(await this.router.navigate(['/group'])){
      this.server.set(server);
    } else {
      this.router.navigate(['/login']).then(() =>{
        this.server.set('');
      })
    }
  }

  login(username: string, password: string) {
    return this.http.post('http://localhost:3200/api/v1/user/login',
      {user: {username, password}},
    ).pipe(catchError(err => err.error)).subscribe(async (e: any) => {
      this.preferencesService.jwt.set(e.jwt)
      console.log(this.user())
      await this.router.navigate(['/profile']);
      return true;
    })
  }

  register(username: string, email: string, password: string) {
    return this.http.post('http://localhost:3200/api/v1/user/register',
      {user: {username, email, password}},
    ).pipe(catchError(err => err.error)).subscribe((e: any) => {
      console.log("RES")
      console.log(e);
    })
  }

  async logout(){
    this.preferencesService.jwt.set('');
    await this.router.navigate(['/login'])
    this.server.set('');
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.server.set('');
  }
}
