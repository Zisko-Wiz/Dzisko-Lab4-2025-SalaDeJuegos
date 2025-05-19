import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SupaService } from '../../services/supa.service';
import { SigninService } from '../../services/signin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [ FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit
{
  public ingreso: Boolean = false;
  public mensajeBienvenida : string = 'BIENVENIDO';

  constructor( private router: Router, private supa: SupaService, protected signInServer: SigninService){}

  ngOnInit(): void
  {
    this.signInServer.getUser();
    setTimeout(() => 
    { console.log(this.signInServer.user);
      if (this.signInServer.user != null)
      {
        this.mensajeBienvenida = "bienvenido teto";
        console.log("teto");
      }
  }, 1000)

    
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
    this.supa.supabase.auth.signOut().then(({ error }) => {
      if (error)
      {
        console.error('Error: ', error.message)
      }else{
        this.ingreso = false;
        this.signInServer.getUser();
      }
    });
  }

  public test()
  {
    console.log(this.signInServer.user);
  }
}
