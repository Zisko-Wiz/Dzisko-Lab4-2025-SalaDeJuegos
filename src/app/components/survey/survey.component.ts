import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { SupaService } from '../../services/supa.service';
import { SigninService } from '../../services/signin.service';

@Component({
  selector: 'app-survey',
  imports:
  [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './survey.component.html',
  styleUrl: './survey.component.scss'
})
export class SurveyComponent implements OnInit
{
  form!: FormGroup;

  constructor(private supabaseService: SupaService, private signInService: SigninService, private router: Router){}

  ngOnInit(): void
  {
    this.signInService.getUser();

    this.form = new FormGroup(
      {
        nombre: new FormControl("", [Validators.pattern(/^[\p{Letter}\p{Mark}]+$/u), Validators.required]),
        apellido: new FormControl("", [Validators.pattern(/^[\p{Letter}\p{Mark}]+$/u), Validators.required]),
        edad: new FormControl("", [Validators.pattern(/^\d+$/), Validators.min(18), Validators.max(99), Validators.required]),
        telefono: new FormControl("", [Validators.pattern(/^\d+$/), Validators.minLength(7), Validators.maxLength(10) , Validators.required]),
        pregunta1: new FormControl("", [Validators.required]),
        pregunta2: new FormControl("", [Validators.required]),
        pregunta3: new FormControl("", [Validators.maxLength(183), Validators.required]),
      }
    )  
  }

  protected sendForm()
  {
    this.insertToSurvey(this.form.value.nombre, this.form.value.apellido, this.form.value.edad, this.form.value.telefono, this.form.value.pregunta1, this.form.value.pregunta2, this.form.value.pregunta3, this.signInService.user!.id);

    this.router.navigate(["/home"])
  }

  public async insertToSurvey(nombre:string, apellido: string, edad: number, telefono:string, juegoFavorito: string, peorJuego:string, sugerencia: string, usuario:string)
  {
    const { error } = await this.supabaseService.supabase.from('surveys')
                      .insert(
                        { nombre: nombre,
                          apellido: apellido,
                          edad: edad,
                          telefono: telefono,
                          juego_favorito: juegoFavorito,
                          peor_juego: peorJuego,
                          sugerencia: sugerencia,
                          usuario:usuario
                        })
  }
}
