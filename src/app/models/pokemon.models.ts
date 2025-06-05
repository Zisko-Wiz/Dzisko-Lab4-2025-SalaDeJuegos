export interface Pokemon
{
    name: string;
    sprites: Sprites;
}

export interface Sprites
{
    other: OtherSprites;
}

export interface OtherSprites
{
    'official-artwork': OfficialArt;
}

export interface OfficialArt
{
    front_default: string;
}