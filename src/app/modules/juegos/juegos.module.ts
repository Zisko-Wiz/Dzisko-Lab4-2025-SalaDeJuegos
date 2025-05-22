import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegosRoutingModule } from './juegos-routing.module';
import { AhorcadoComponent } from '../../components/ahorcado/ahorcado.component';
import { MayorMenorComponent } from '../../components/mayor-menor/mayor-menor.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    JuegosRoutingModule
  ],
  exports: []
})
export class JuegosModule { }
