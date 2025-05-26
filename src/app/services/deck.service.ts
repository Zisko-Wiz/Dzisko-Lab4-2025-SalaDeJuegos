import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Deck } from '../models/deck.models';

@Injectable({
  providedIn: 'root'
})
export class DeckService {

  constructor(private http: HttpClient) { }

  public getDeck(deckCount: string = "1")
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=${deckCount}`);
  }

  public drawCard(id: string, count: string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${count}`);
  }

  public addToPile(deckId: string, pileName: string, cards: string)
  {
    return this.http.get<Deck>(`https://deckofcardsapi.com/api/deck/${deckId}/pile/${pileName}/add/?cards=${cards}`);
  }
}
