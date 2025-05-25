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
  private deck?: Deck;
  private discardPile? : Deck;
  protected remainingCards: number = 50;
  private deckSubscription!: Subscription;
  private pileSubscription!: Subscription;
  protected drawnCard?: Card;
  protected previousCard?: Card;
  protected score: number = 50;

  constructor(private http: HttpClient, private deckService: DeckService){}

  public ngOnInit(): void
  {
    //this.getDeck();
  }

  public ngOnDestroy(): void
  {
    //this.deckSubscription.unsubscribe();
    if (this.pileSubscription != undefined)
    {
      this.pileSubscription.unsubscribe();
    }
  }

  private getDeck()
  {
    this.deckSubscription = this.deckService.drawCard("new","1").subscribe(
      {
        next: (data: Deck) => 
        {
          this.deck = data;
        }
      }
    )
  }

  private addToDiscard()
  {
    this.pileSubscription = this.deckService.addToPile(this.deck?.deck_id!, "discard", this.deck?.cards[0].code!).subscribe(
      {
        next: (data: Deck) =>
        {
          this.discardPile = data;
        }
      }
    )
  }

  private drawNewCard()
  {
    this.deckSubscription = this.deckService.drawCard(this.deck?.deck_id!, "1").subscribe(
    {
      next: (data: Deck) => 
      {
        if (this.drawnCard != undefined)
        {
          this.previousCard = this.drawnCard;
        }

        this.drawnCard = data.cards[0];
        this.remainingCards = data.remaining;
        this.addToDiscard();
      }
    }
    )
  }

  public test()
  {
  }
}
