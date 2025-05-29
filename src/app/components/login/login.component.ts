import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { SupaService } from '../../services/supa.service';


@Component({
  selector: 'app-login',
  imports:
  [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})

export class LoginComponent
{
  email: string = '';
  password: string = '';
  error: boolean = false;

  constructor(private router: Router, private supa: SupaService) {}

  goToRegistrarse()
  {
    this.router.navigate(['/registrarse']);
  }

  goToHome()
  {
    this.router.navigate(['/']);
  }

  login()
  {
    this.supa.supabase.auth.signInWithPassword
    ({
      email: this.email,
      password: this.password
    }
    ).then(({ data, error}) => {
      if (error)
      {
        console.error('Error: ', error.message);
        this.error = true;
      }else{
        this.supa.supabase.from('ingresos').insert([
          {
            usuario: data.user.email
          }
        ]).then(({error}) =>
        {
          if (error)
          {
            console.error('Error: ', error.message);
          } else {
            this.error = false;
            this.router.navigate(['/home']);
          }
        }
      )}
    });
  }

  llenarAlpha()
  {
    this.email = 'admin@admin.com';
    this.password = '111111';
  }

  llenarBeta()
  {
    this.email = 'usuario@usuario.com';
    this.password = '333333';
  }

  llenarGamma()
  {
    this.email = 'tester@tester.com';
    this.password = '555555';
  }
  
}
