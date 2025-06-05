import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Pokemon } from '../models/pokemon.models';

@Injectable({
  providedIn: 'root'
})
export class PokeapiService
{

  constructor(private http: HttpClient) {}

  public getPokemon(idOrName:string)
  {
    return this.http.get<Pokemon>(`https://pokeapi.co/api/v2/pokemon/${idOrName}/`);
  }
}
