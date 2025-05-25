import { Image } from "./image.models";

export interface Card
{
    code: string;
    image: string;
    images: Image;
    value: string;
    suit: string;
}