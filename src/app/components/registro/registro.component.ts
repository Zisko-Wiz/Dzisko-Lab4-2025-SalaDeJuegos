import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgForm, FormControl, FormsModule, ReactiveFormsModule, Validators, FormGroupDirective } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { createClient } from '@supabase/supabase-js'
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import {ErrorStateMatcher} from '@angular/material/core';

const supabase = createClient(environment.apiUrl, environment.publicAnonKey)

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'app-registro',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CommonModule, ReactiveFormsModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  correo: string = '';
  password: string = '';
  errorUsuarioExiste : boolean = false;
  readonly emailFormControl  = new FormControl('', [Validators.required, Validators.email]);
  readonly passwordFormControl  = new FormControl('', [Validators.required]);
  matcher = new MyErrorStateMatcher();


  constructor(private router: Router){}

  registrar()
  {
    supabase.auth.signUp
    (
      {
        email: this.correo,
        password: this.password
      }
    ).then(({error}) =>
      {
        if(error?.code == 'user_already_exists')
        {
          console.error('Error:', error.message);
          this.errorUsuarioExiste = true;
        } else {
          this.router.navigate(['/home'])
        }
      }
    )
  }
}
