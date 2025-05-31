import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes =
[
  {
    path: 'ahorcado',
    loadComponent: () => import('../../components/ahorcado/ahorcado.component').then(c => c.AhorcadoComponent)
  },
  {
    path: 'mayor-menor',
    loadComponent: () => import('../../components/mayor-menor/mayor-menor.component').then(c => c.MayorMenorComponent)
  },
  {
    path: 'scoundrel',
    loadComponent: () => import('../../components/scoundrel/scoundrel.component').then(c => c.ScoundrelComponent)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegosRoutingModule { }
