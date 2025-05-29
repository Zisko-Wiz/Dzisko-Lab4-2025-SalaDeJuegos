import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { JuegosModule } from './modules/juegos/juegos.module';
import { FooterComponent } from './components/footer/footer.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, JuegosModule, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SalaDeJuegos';
}
