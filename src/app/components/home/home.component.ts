import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterLink } from '@angular/router';
import { ChatComponent } from '../chat/chat.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports:
  [ 
    HeaderComponent,
    ChatComponent,
    RouterLink,
    MatCardModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router){}

  goToAhorcado()
  {
    this.router.navigate(['juegos/ahorcado']);
  }

  goToMayorMenor()
  {
    this.router.navigate(['juegos/mayorMenor']);
  }
}
