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
  protected canPlay:boolean = false;
  protected lives = 3;
  protected score = 0;
  protected giveUp: boolean = false;
  protected pokemonImage: string = "";
  protected pokemonNames: string[] = ["opt1", "opt2", "opt3", "opt4"];
  protected pokemonCorrectAnswer: string = "";
  protected answer: number = 0;
  private pokeApiSubscription?: Subscription;

  constructor(private pokeapi: PokeapiService){}

  ngOnInit(): void
  {
    this.startNewQuestion()
  }

  ngOnDestroy(): void
  {
    this.pokeApiSubscription?.unsubscribe()
  }

  private resetValues()
  {
    this.pokemonCorrectAnswer = "";
    this.pokemonImage = "";
    this.answer = 0;
  }

  protected startNewQuestion()
  {
    let pokemonIdUsed: number[] = [];
    let randomPokemonId = Math.floor(Math.random() * (1026 - 1) + 1);
    let pokemonSelected: Number = Math.floor(Math.random() * (4 - 0) + 0) ;
    let selectPokemon: boolean = false;

    this.resetValues();

    for (let index = 0; index < 4; index++)
    {
      while (pokemonIdUsed.includes(randomPokemonId))
      {
        randomPokemonId = Math.floor(Math.random() * (1026 - 1) + 1)
      }

      pokemonIdUsed.push(randomPokemonId);

      if (index === pokemonSelected)
      {
        selectPokemon = true;  
      }

      this.getPokemon(String(randomPokemonId),index, selectPokemon);
      selectPokemon = false;
    }

  }

  private getPokemon(pokemonId: string, index:number, selectAnswerPokemon: boolean)
  {
    this.pokeApiSubscription = this.pokeapi.getPokemon(pokemonId).subscribe(
      {
        next: (data: Pokemon) =>
        {
          this.pokemonNames[index] = data.name;

          if (selectAnswerPokemon)
          {
            this.pokemonImage = data.sprites.other['official-artwork'].front_default;
            this.pokemonCorrectAnswer = data.name;
          }

          if (index == 3)
          {
            this.canPlay = true;  
          }
        }
      }
    )
  }

  protected capitalizeWord(word: string) : string
  {
    return word[0].toUpperCase() + word.slice(1);
  }

  protected optionSelected(option: number)
  {
    let scoredPoints = 0;
    switch (option)
    {
      case 0:
        if (this.pokemonNames[option] == this.pokemonCorrectAnswer)
        {
          this.answer = 1; 
          scoredPoints = 1;           
        } else
        {
          this.answer = 5;
        }
        break;

      case 1:
        if (this.pokemonNames[option] == this.pokemonCorrectAnswer)
        {
          this.answer = 2;
          scoredPoints = 1;
        } else
        {
          this.answer = 6;
        }
        break;

      case 2:
        if (this.pokemonNames[option] == this.pokemonCorrectAnswer)
        {
          this.answer = 3;
          scoredPoints = 1;
        } else
        {
          this.answer = 7;
        }
        break;

      case 3:
        if (this.pokemonNames[option] == this.pokemonCorrectAnswer)
        {
          this.answer = 4;
          scoredPoints = 1;
        } else
        {
          this.answer = 8;
        }
        break;
    }
    if (scoredPoints > 0)
    {
      this.score += scoredPoints;      
    }
    else
    {
      this.lives -= 1;
    }

    this.canPlay = false;

    setTimeout(()=>{this.startNewQuestion()}, 1000);
  }

  protected giveUpGame()
  {
    this.giveUp = true;
  }

  protected resetGame()
  {
    this.lives = 3;
    this.giveUp = false;
    this.score = 0;
    this.resetValues();
    this.startNewQuestion();
  }
}
