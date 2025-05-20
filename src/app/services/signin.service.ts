import { Injectable } from '@angular/core';
import { SupaService } from './supa.service';

@Injectable({
  providedIn: 'root'
})
export class SigninService {
  public user: object|null = null;
  public email: string = "";

  constructor(private supaService: SupaService)
  {
    this.getUser();
  }

  public getUser()
    {
      this.supaService.supabase.auth.getUser().then(({data}) =>
        { 
          this.user = data.user;
          if (data.user?.email != undefined)
          {
            this.email = data.user.email;
          }
        });
    }
}
