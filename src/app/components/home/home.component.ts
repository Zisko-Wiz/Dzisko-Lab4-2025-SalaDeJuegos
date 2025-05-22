import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [HeaderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router){}

  goToAhorcado()
  {
    this.router.navigate(['juegos/ahorcado'])
  }

  goToMayorMenor()
  {
    this.router.navigate(['juegos/mayorMenor']);
  }
}
