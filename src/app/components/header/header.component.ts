import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { SupaService } from '../../services/supa.service';
import { SigninService } from '../../services/signin.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario.models';

@Component({
  selector: 'app-header',
  imports: [ FormsModule ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy
{
  public ingreso: Boolean = false;
  public mensajeBienvenida? : string = '';
  public subscription!: Subscription;

  constructor( private router: Router, private supa: SupaService, protected signInService: SigninService){}

  ngOnInit(): void
  {
    this.signInService.getUser();
    this.getUser();
  }

  ngOnDestroy(): void
  {
    this.subscription.unsubscribe();
  }

  public goToLogin()
  {
    this.router.navigate(['login']);
  }

  public goToRegister()
  {
    this.router.navigate(['registrarse']);
  }

  public logOut()
  {
    this.supa.supabase.auth.signOut().then(({ error }) =>
    {
      if (error)
      {
        console.error('Error: ', error.message)
      }else{
        this.ingreso = false;
        this.mensajeBienvenida = "";
      }
    });
  }

  public getUser()
  {
    this.subscription = this.signInService.emitter
    .subscribe(
    {
      next: (data: Usuario) =>
      {
        if (data.email != "")
        {
          let nombre: string  = data.email.replace(/\@+(.+)/, "");
          let nombreCapitalized: string = nombre[0].toUpperCase() + nombre.slice(1);
          this.mensajeBienvenida = "Bienvenido " + nombreCapitalized;
          this.ingreso = true;
        }
      }
    })
  }
}
