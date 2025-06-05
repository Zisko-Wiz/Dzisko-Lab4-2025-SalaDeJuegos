import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';
import { PokeapiService } from '../../services/pokeapi.service';
import { Subscription } from 'rxjs';
import { Pokemon } from '../../models/pokemon.models';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-preguntados',
  imports:
  [
    HeaderComponent,
    ChatComponent,
    MatButtonModule
  ],
  templateUrl: './preguntados.component.html',
  styleUrl: './preguntados.component.scss'
})
export class PreguntadosComponent implements OnInit, OnDestroy
{
  protected canPlay:boolean = true;
  protected lives = 3;
  protected pokemonImage: string = "";
  protected pokemonNames: string[] = ["Pikachu", "Charmander", "Gengar", "Metapod"];
  protected pokemonCorrectAnswer: string = "";
  private pokeApiSubscription?: Subscription;

  constructor(private pokeapi: PokeapiService){}

  ngOnInit(): void
  {
  }

  ngOnDestroy(): void
  {
    this.pokeApiSubscription?.unsubscribe()
  }

  protected getPokemonImage()
  {
    this.pokeApiSubscription = this.pokeapi.getPokemon("3").subscribe(
      {
        next: (data: Pokemon) =>
        {
          this.pokemonImage = data.sprites.other['official-artwork'].front_default;
          
        }
      }
    )
  }
}
