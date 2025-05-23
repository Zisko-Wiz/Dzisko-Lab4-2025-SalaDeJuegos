import { Component, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router, RouteReuseStrategy } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-ahorcado',
  imports:
  [
    HeaderComponent,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './ahorcado.component.html',
  styleUrl: './ahorcado.component.scss',
})
export class AhorcadoComponent implements OnInit, OnDestroy
{
  public letrasIncorrectas: string[] = [];
  public letrasCorrectas: string[] = [];
  public listaPalabras: string[] = ["BALLESTA", "INTERNET", "AGRUPAR", "COMPARTIMIENTO" ,"CLEMENTE"];
  public palabraActual: string = "";
  public progresoPalabra: string = "";
  public end: boolean = false;
  public subscription: Subscription = new Subscription();
  public emmiter = new EventEmitter<string>();

  constructor(private router: Router, private reuse: RouteReuseStrategy) {}

  ngOnInit(): void
  {
    let minCeiled = Math.ceil(0);
    let maxFloored = Math.floor(4);
    this.palabraActual = this.listaPalabras[Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled)];
    for (let index = 0; index < this.palabraActual.length; index++)
    {
      this.letrasCorrectas.push("_");  
    }
    this.actualizarPalabra()
    this.mostrarProgreso()
  }

  ngOnDestroy(): void
  {
    this.subscription.unsubscribe();
  }
  
  ingresarLetra(letraIngresada: string)
  {
    let re = new RegExp(`${letraIngresada}`, 'g');
    let isMatch = this.palabraActual.match(re); 
    if(isMatch)
    {
      for (let index = 0; index < this.palabraActual.length; index++)
      {
        if (this.palabraActual[index] == letraIngresada)
        {
          this.letrasCorrectas[index] = letraIngresada;  
        }
      }
      this.actualizarPalabra()

      re = new RegExp('_', 'g');
      isMatch = this.progresoPalabra.match(re);

      if (!isMatch)
      {
        this.end = true;
      }
    } else {
      this.letrasIncorrectas.push(letraIngresada);
      if (this.letrasIncorrectas.length == 5)
      {
       this.end = true; 
      }
    }
  }

  actualizarPalabra()
  {
    this.progresoPalabra = this.letrasCorrectas.join(" ")
    this.emmiter.emit(this.progresoPalabra);
  }

  mostrarProgreso()
  {
    this.subscription = this.emmiter.subscribe(
      {
        next: (data: string) =>
        {
          this.progresoPalabra = data;
        }
      }
    )
  }

  refresh()
  {
    this.reuse.shouldReuseRoute = function()
    {
      return false;
    }
    this.router.navigated = false;
    this.router.navigate([this.router.url]);
  }

  checkIfLetterIsUsed(letter:string) : number
  {
    if (this.letrasIncorrectas.includes(letter))
    {
      return 1;
    } else if ( this.letrasCorrectas.includes(letter))
    {
      return 2;
    }
    return 0;
  }
}