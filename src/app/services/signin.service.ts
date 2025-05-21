import { EventEmitter, Injectable } from '@angular/core';
import { SupaService } from './supa.service';
import { Usuario } from '../models/usuario.models';

@Injectable({
  providedIn: 'root'
})
export class SigninService {
  public user: Usuario;
  public emitter = new EventEmitter<Usuario>()

  constructor(private supaService: SupaService)
  {
    this.user = new Usuario("");
  }

  public getUser()
  {
    this.supaService.supabase.auth.getUser().then(({data}) =>
    { 
      if (data.user?.email != undefined)
      {
        this.user.email = data.user?.email;
        this.emitter.emit(this.user);
      }
    });
  }
}
