import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';
import { HttpClient } from '@angular/common/http';
import { Deck } from '../../models/deck.models';
import { Subscription } from 'rxjs';
import { DeckService } from '../../services/deck.service';
import { Card } from '../../models/card.models';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mayor-menor',
  imports:
  [
    HeaderComponent,
    ChatComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './mayor-menor.component.html',
  styleUrl: './mayor-menor.component.scss',
})
export class MayorMenorComponent implements OnInit, OnDestroy
{
  protected deck?: Deck;
  private discardPile? : Deck;
  protected remainingCards: number = 50;
  private deckSubscription!: Subscription;
  private pileSubscription!: Subscription;
  protected drawnCard?: Card;
  protected previousCard?: Card;
  protected score: number = 0;
  protected started: boolean = false;
  protected cardVisible: boolean = false;
  protected canPlay: boolean = false;
  protected mayorCorrect: number = 0;
  protected menorCorrect: number = 0;
  protected lives: number = 3;
  protected giveUp: boolean = false;

  constructor(private http: HttpClient, private deckService: DeckService){}

  public ngOnInit(): void
  {
    this.getDeck();
  }

  public ngOnDestroy(): void
  {
    this.deckSubscription.unsubscribe();
    if (this.pileSubscription != undefined)
    {
      this.pileSubscription.unsubscribe();
    }
  }

  private getDeck()
  {
    this.deckSubscription = this.deckService.getDeck().subscribe(
      {
        next: (data: Deck) => 
        {
          this.deck = data;
        }
      }
    )
  }

  private addToDiscard(cardCode:string)
  {
    this.pileSubscription = this.deckService.addToPile(this.deck?.deck_id!, "discard", `${cardCode}`).subscribe(
      {
        next: (data: Deck) =>
        {
          this.discardPile = data;
        }
      }
    )
  }

  protected drawNewCard(count:string = "1")
  {
    this.deckSubscription = this.deckService.drawCard(this.deck?.deck_id!, `${count}`).subscribe(
    {
      next: (data: Deck) => 
      {
        if (this.drawnCard == undefined)
        {
          this.previousCard = data.cards[0];
          this.drawnCard = data.cards[1];
        }
        else
        {
          this.previousCard = this.drawnCard;
          this.drawnCard = data.cards[0];
          this.addToDiscard(data.cards[0].code);
          console.log(data.cards[0].code);
          
        }

        this.remainingCards = data.remaining;
      }
    }
    )
  }

  protected startNewGame()
  {
    this.started = true;
    this.drawNewCard("2");
  }

  private showCard()
  {
    this.cardVisible = true;

    setTimeout(()=>{this.cardVisible = false}, 2000);
  }

  private disablePlayerInput()
  {
    this.canPlay = true;
    setTimeout(()=>{this.canPlay = false}, 2000);
  }

  private isNumber(str: string) : boolean
  {
    if (str.search(/^\d+$/)! >= 0)
    {
      return true
    }

    return false;
  }

  private checkResults() : number
  {
    let previousCardValue: number = -1;
    let drawnCardValue: number = -1;

    if (!this.isNumber(this.previousCard?.value!))
    {
      switch (this.previousCard?.value)
      {
        case "ACE":
          previousCardValue = 1;
          break;

        case "KING":
          previousCardValue = 13;
          break;
        
        case "QUEEN":
          previousCardValue = 12;
          break;

        case "JACK":
          previousCardValue = 11;
          break
      }
    } else
    {
      previousCardValue = parseInt(this.previousCard?.value!);
    }

    if (!this.isNumber(this.drawnCard?.value!))
    {
      switch (this.drawnCard?.value)
      {
        case "ACE":
          drawnCardValue = 1;
          break;

        case "KING":
          drawnCardValue = 13;
          break;
        
        case "QUEEN":
          drawnCardValue = 12;
          break;

        case "JACK":
          drawnCardValue = 11;
          break
      }
    }
    else
    {
      drawnCardValue = parseInt(this.drawnCard?.value!);
    }

    if (previousCardValue == drawnCardValue)
    {
      return 0;  
    } else if (previousCardValue < drawnCardValue)
    {
      return 2;
    } else
    {
      return 1;
    }
  }

  protected optionSelected(option: string)
  {
    this.showCard();
    this.disablePlayerInput();

    switch (option)
    {
      case "mayor":
        this.mayorCorrect = this.checkResults();
        setTimeout(()=>{this.mayorCorrect = 0}, 2000);
        if (this.mayorCorrect == 2)
        {
          this.score += 1
        }
        else if(this.mayorCorrect == 1)
        {
          this.lives -= 1;
        }
        break;

      case "menor":
        this.menorCorrect = this.checkResults();
        setTimeout(()=>{this.menorCorrect = 0}, 2000);
        if (this.menorCorrect == 1)
        {
          this.score += 1
        }
        else if (this.menorCorrect == 2)
        {
          this.lives -= 1;
        }
        break
    }

    setTimeout(()=>{this.drawNewCard();
    }, 2000);

    console.log(this.remainingCards);
  }
  
  private reshuffleDeck()
  {
    this.deckSubscription = this.deckService.reshuffleDeck(this.deck?.deck_id!).subscribe(
    {
      next: (data: Deck) => 
      {
        this.remainingCards = data.remaining;
        this.started = false;
      }
    }
    )
  }

  protected reset()
  {
    this.score = 0;
    this.lives = 3;
    this.giveUp = false;
    this.reshuffleDeck();
  }

}
