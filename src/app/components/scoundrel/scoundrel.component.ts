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
  protected gameOver: boolean = false;
  protected score: number = 0;
  protected lifePoints: number = 20;
  protected isWeaponEquipped: boolean = false;
  private isPotionConsumed: boolean = false;
  protected hasFled: boolean = false;
  protected lastMonsterKilledCode: string = "";
  protected lastMonsterKilledValue: number = 0;
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
        },
        complete: () =>
        {
          this.canPlay = true;
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

  private discardFromPile(pileSubscription: Subscription | undefined, pileName: string, cardsCodes: string,checkRoom:boolean = true, altCardCode: string = "")
  {
    pileSubscription = this.deckService.drawFromPile(this.deck!.deck_id, pileName, cardsCodes).subscribe(
    {
      next: (data: Deck) => 
      {
        for (let index = 0; index < data.cards.length; index++)
        {
          this.addToPile(pileSubscription, "discard", data.cards[index].code, true);
        }
      },
      complete: () =>
      {
        if (pileName == "hand")
        {
          this.addToPile(this.handSubscription, "hand", altCardCode, false);  
        }
      }
    }
    )
  }

  private addToPile(pileSubscription: Subscription | undefined, pileName: string, cardsCodes: string, checkRoom: boolean = true)
  {
    pileSubscription = this.deckService.addToPile(this.deck?.deck_id!, pileName, cardsCodes).subscribe(
    {
      next: () =>
      {
        if (pileName != "discard")
        {
          this.getPile(pileSubscription, pileName);          
        }

        if (checkRoom)
        {
          this.getPile(this.roomSubscription, "room");          
        }
      }
    }
    )
  }

  private returnPile(pileSubscription: Subscription | undefined, pileName: string)
  {
    pileSubscription = this.deckService.returnPileCardsToDeck(this.deck?.deck_id!, pileName).subscribe(
    {
      next: () =>
      {
        this.getPile(pileSubscription, pileName);
      },
      complete: () =>
      {
        this.drawNewCard("4");
        this.score += 1;
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
              console.log(this.handPile);
              
              this.isWeaponEquipped = true;
          break;
        }
      },
      complete: () =>
      {
        this.canPlay = true;

        switch (pileName) {
          case "room":
            this.checkRoom();
            break;
        
          default:
            break;
        }
      }      
    }
    )
  }

  private getListOfCards(deck:Deck) : string[]
  {
    let cards: string[] = [];

    for (let index = 0; index < deck.cards.length!; index++)
    {
      cards.push(deck.cards[index].code);
    }
    
    return cards;
  }

  protected drawNewRoom()
  {
    let count: string;

    if (this.roomPile == undefined)
    {
      count = "4";  
    } else {
      let c = 4 - this.roomPile.cards.length;
      count = String(c);
    }

    if (Number(count) < this.deck?.remaining!)
    {
      this.drawNewCard(count);
    } else {
      this.drawNewCard(String(this.deck?.remaining));
    }
  }

  protected startNewGame()
  {
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
    this.canPlay = false;
    let damage: number = this.deckService.getCardValue(cardValue, true);

    if (useWeapon)
    {
      let weaponValue = this.deckService.getCardValue(this.handPile!.cards.find( (card) => { return this.isDiamond(card.code)} )!.value, true);
      
      if (weaponValue < damage)
      {
        this.lifePoints -= (damage - weaponValue)
      }
      this.killMonster(cardCode, true);
    } else {
      this.lifePoints -= damage;
      this.killMonster(cardCode);
    }
  }

  protected killMonster(cardCode: string, useWeapon: boolean = false)
  {
    if (useWeapon)
    {
      this.addToPile(this.handSubscription, "hand", cardCode);
      this.lastMonsterKilledCode = cardCode;
    } else{
      this.discardFromPile(this.roomSubscription, "room", cardCode);
    }
  }

  private checkRoom() : void
  { 
    if (this.roomPile != undefined && this.roomPile.cards.length == 1)
    {
      this.canPlay = false;
      this.isPotionConsumed = false;
      this.hasFled = false;
      this.score += 1;

      if (this.deck?.remaining! <= 0)
      {
        this.gameOver = true;  
      } else if (this.roomPile.cards.length < 4)
      {
        this.drawNewRoom();
      }

    }
  }

  protected equipWeapon(cardCode: string) 
  {
    this.canPlay = false;

    if(this.isWeaponEquipped)
    {
      this.isWeaponEquipped = false;
      
      if (this.handPile?.cards.length === 1)
      {
        this.discardFromPile(this.handSubscription, "hand", this.handPile.cards[0].code, true, cardCode)
      } else {
        this.discardFromPile(this.handSubscription, "hand", this.getListOfCards(this.handPile!).join(","), true, cardCode );
      }
      
    } else
    {
      this.addToPile(this.handSubscription, "hand", cardCode);
    }
  }

  protected drinkPotion(cardCode: string, cardValue: string)
  {
    this.canPlay = false;
    if (!this.isPotionConsumed)
    {
      var potionValue = this.deckService.getCardValue(cardValue, true);
      
      this.isPotionConsumed = true;
      
      if ( (potionValue + this.lifePoints) > 20)
      {
        this.lifePoints = 20;  
      } else {
        this.lifePoints += potionValue;
      }
    }

    this.discardFromPile(this.roomSubscription, "room", cardCode);
  }

  protected flee()
  {
    this.hasFled = true;
    this.returnPile(this.roomSubscription, "room");    
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

  protected giveUpGame()
  {
    this.giveUp = true;
  }

  protected reset()
  {
    this.score = 0;
    this.lifePoints = 20;
    this.giveUp = false;
    this.isWeaponEquipped = false;
    this.isPotionConsumed = false;
    this.gameOver = false;
    this.hasFled = false;
    this.handPile = undefined;
    this.roomPile = undefined;
    this.fledPile = undefined;
    this.lastMonsterKilledCode = "";
    this.lastMonsterKilledValue = 0;
    this.equipedWeapon = undefined;
    this.reshuffleDeck();
    this.started = false;
  }
}
