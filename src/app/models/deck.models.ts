import { Card } from "./card.models";

export interface Deck
{
    success: boolean;
    deck_id: string;
    cards: Card[];
    shuffled: boolean;
    remaining: number;
    piles: Deck;
    room: Deck;
    hand: Deck;
}
