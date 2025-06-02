import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deck } from '../models/deck.models';

@Injectable({
  providedIn: 'root'
})
export class DeckService
{

  constructor(private http: HttpClient) { }

  public getDeck(deckCount: string = "1")
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`);
  }

  public getPartialDeck(cards:string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${cards}`);
  }

  public drawCard(id: string, count: string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${count}`);
  }

  public drawFromPile(id: string, pileName: string, cardsCodes: string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/${id}/pile/${pileName}/draw/?cards=${cardsCodes}`);
  }

  public addToPile(deckId: string, pileName: string, cardsCodes: string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/add/?cards=${cardsCodes}`);
  }

  public reshuffleDeck(id: string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/${id}/shuffle/`);
  }

  public getCardsInPile(deckId: string, pileName:string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/list/`);
  }

  public isNumber(str: string) : boolean
  {
    if (str.search(/^\d+$/)! >= 0)
    {
      return true
    }

    return false;
  }

  public getCardValue(cardValue: string):  number
  {
    if (!this.isNumber(cardValue))
    {
      switch (cardValue)
      {
        case "ACE":
          return 1;

        case "KING":
          return 13;
        
        case "QUEEN":
          return 12;

        case "JACK":
          return 11;
      }
    }
    
    
    return parseInt(cardValue);
    
  }

}
