import {Injectable, signal} from '@angular/core';
import {PreferencesService} from "@services/preferences/preferences.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  server = signal('');

  constructor(private preferencesService: PreferencesService) { }

  selectServer(server: string){
    this.server.set(server)
  }
}
