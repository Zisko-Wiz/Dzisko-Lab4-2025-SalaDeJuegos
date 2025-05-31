import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-scoundrel',
  imports:
  [
    HeaderComponent,
    ChatComponent,
    MatButtonModule
  ],
  templateUrl: './scoundrel.component.html',
  styleUrl: './scoundrel.component.scss'
})
export class ScoundrelComponent {

}
