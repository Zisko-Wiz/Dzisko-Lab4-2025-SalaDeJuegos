import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ChatComponent } from '../chat/chat.component';
import { MatButtonModule } from '@angular/material/button';
import { DeckService } from '../../services/deck.service';
import { Deck } from '../../models/deck.models';
import { Subscription } from 'rxjs';
import { Card } from '../../models/card.models';

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
export class ScoundrelComponent implements OnInit, OnDestroy
{
  protected canPlay: boolean = false;
  protected started: boolean = false;
  protected giveUp: boolean = false;
  protected score: number = 0;
  protected lifePoints: number = 20;
  protected isWeaponEquipped: boolean = false;
  protected lastMonsterKilled?: Card;
  protected equipedWeapon?: Card;
  protected deck?: Deck;
  private deckSubscription?: Subscription;
  private discardSubscription?: Subscription;
  protected handPile?: Deck;
  private handSubscription?: Subscription;
  protected roomPile?: Deck;
  private roomSubscription?: Subscription;
  protected fledPile?: Deck;
  private fledSubscription?: Subscription;
  private cardsincludingInDeck: string = "AS,AC,2S,2D,2C,2H,3S,3D,3C,3H,4S,4D,4C,4H,5S,5D,5C,5H,6S,6D,6C,6H,7S,7D,7C,7H,8S,8D,8C,8H,9S,9D,9C,9H,0S,0D,0C,0H,JS,JC,QS,QC,KS,KC";
  

  constructor( protected deckService: DeckService){}

  ngOnInit(): void
  {
    this.disablePlayerInput();
    this.getDeck();
  }

  ngOnDestroy(): void
  {
    this.deckSubscription?.unsubscribe();
    this.handSubscription?.unsubscribe();
    this.roomSubscription?.unsubscribe();
    this.fledSubscription?.unsubscribe();
    this.discardSubscription?.unsubscribe();
  }

  private getDeck()
  {
    this.deckSubscription = this.deckService.getPartialDeck(this.cardsincludingInDeck).subscribe(
      {
        next: (data: Deck) => 
        {
          this.deck = data;
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
        this.deck = data;
        this.addToPile(this.roomSubscription,"room", this.getListOfCards(data).join(","));
      }
    })
  }

  private async discardFromPile(pileSubscription: Subscription | undefined, pileName: string, cardsCodes: string)
  {
    pileSubscription = this.deckService.drawFromPile(this.deck!.deck_id, pileName, cardsCodes).subscribe(
      {
        next: (data: Deck) => 
        {
          for (let index = 0; index < data.cards.length; index++)
          {
            this.addToPile(pileSubscription, "discard", data.cards[index].code);
          }
        }
      }
    )
  }

  private addToPile(pileSubscription: Subscription | undefined, pileName: string, cardsCodes: string)
  {
    pileSubscription = this.deckService.addToPile(this.deck?.deck_id!, pileName, cardsCodes).subscribe(
    {
      next: () =>
      {
        if (pileName != "discard")
        {
          this.getPile(pileSubscription, pileName);          
        }
          this.getPile(this.roomSubscription, "room");
      }
    }
    )
  }

  private getPile(pileSubscription: Subscription | undefined, pileName: string)
  {
    pileSubscription = this.deckService.getCardsInPile(this.deck?.deck_id!, pileName).subscribe(
    {
      next: (data: Deck) =>
      {
        switch (pileName)
        {
          case "room":
            this.roomPile = data.piles.room;
            break;

          case "hand":
            this.handPile = data.piles.hand;
            this.isWeaponEquipped = true;
            console.log(data.piles.hand);
            
            if (this.handPile.cards.length == 2)
            {
              this.lastMonsterKilled = this.handPile.cards.find( (card) => { return card.suit != "DIAMONDS";
              } );
              
            }

            break;
        }
      }
    }
    )
  }

  private getListOfCards(deck:Deck) : string[]
  {
    let cards: string[] = [];

    for (let index = 0; index < this.deck?.cards.length!; index++)
    {
      cards.push(deck.cards[index].code);
    }

    return cards;
  }

  protected drawNewRoom()
  {
    let count: string;
    
    if (this.roomPile?.cards == undefined)
    {
      count = "4";  
    } else {
      let c = 4 - this.roomPile.cards.length;
      count = String(c);
    }

    this.drawNewCard(count);
  }

  protected startNewGame()
  {
    this.disablePlayerInput();
    this.started = true;
    this.drawNewRoom();
  }

  protected isRed(cardCode: string) : boolean
  {
    let re = cardCode.search(/([DH])/);

    if (re > 0)
    {
      return true  
    }

    return false;
  }

  protected isDiamond(cardCode: string) : boolean
  {
    let re = cardCode.search(/([D])/);

    if (re >0)
    {
      return true
    }

    return false;
  }

  protected attack(cardCode: string, cardValue:string, useWeapon: boolean = false)
  {
    let damage: number = this.deckService.getCardValue(cardValue);

    this.disablePlayerInput();

    if(damage == 1)
    {
      damage = 14;
    }

    if (useWeapon)
    {
      let weaponValue = this.deckService.getCardValue(this.handPile!.cards.find( (card) => { return this.isDiamond(card.code)} )!.value);
      
      if (weaponValue < damage)
      {
        this.lifePoints -= (damage - weaponValue)
      }
      this.killMonster(cardCode,cardValue ,true);
    } else {
      this.lifePoints -= damage;
      this.killMonster(cardCode, cardValue);
    }
  }

  protected killMonster(cardCode: string, cardValue:string, useWeapon: boolean = false)
  {
    if (useWeapon)
    {
      if (this.handPile?.cards.length! < 2 )          
      {
        this.addToPile(this.handSubscription, "hand", cardCode);
      } else
      {
        this.discardFromPile(this.discardSubscription, "hand", this.lastMonsterKilled?.code!)
        .then( () => { this.addToPile(this.handSubscription, "hand", cardCode); } );
      }
    } else{
      this.addToPile(this.discardSubscription, "discard", cardCode);
    }
  }

  protected equipWeapon(cardCode: string)
  {
    this.disablePlayerInput();
    this.lastMonsterKilled = undefined;

    if(this.isWeaponEquipped)
    {
      this.isWeaponEquipped = false;
      this.addToPile(this.discardSubscription, "discard", this.handPile!.cards.find( (card) => { return this.isDiamond(card.code)} )!.code);
      if (this.lastMonsterKilled != undefined)
      {
        this.addToPile(this.discardSubscription, "discard", this.handPile!.cards.find( (card) => { return !this.isDiamond(card.code)} )!.code);  
        this.lastMonsterKilled = undefined;
      }
      this.handPile!.cards.length = 0;
    }

    this.addToPile(this.handSubscription, "hand", cardCode);
  }

  private reshuffleDeck()
  {
    this.deckSubscription = this.deckService.reshuffleDeck(this.deck?.deck_id!).subscribe(
    {
      next: (data: Deck) => 
      {
        this.deck = data;
      }
    }
    )
  }

  protected reset()
  {
    this.disablePlayerInput();
    this.score = 0;
    this.lifePoints = 20;
    this.giveUp = false;
    this.isWeaponEquipped = false;
    this.handPile = undefined;
    this.roomPile = undefined;
    this.fledPile = undefined;
    this.lastMonsterKilled = undefined;
    this.equipedWeapon = undefined;
    this.reshuffleDeck();
    this.started = false;
  }

  private disablePlayerInput()
  {
    this.canPlay = true;
    setTimeout(()=>{this.canPlay = false}, 1000);
  }

}
