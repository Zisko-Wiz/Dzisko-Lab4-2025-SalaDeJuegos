import { Card } from "./card.models";

export interface Deck
{
    success: boolean;
    deck_id: string;
    cards: Card[];
    shuffled: boolean;
    remaining: number;
    pile: Deck[];

}
