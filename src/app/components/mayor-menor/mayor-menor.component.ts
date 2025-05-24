import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-mayor-menor',
  imports:
  [
    HeaderComponent,
    ChatComponent
  ],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss',
})
export class MayorMenorComponent
{

}
