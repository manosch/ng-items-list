import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CharDTO, ResponseDTO } from '../models/response-dto';

@Injectable({
  providedIn: 'root',
})
export class CharacterApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';

  fetchCharacters(page: number): Observable<ResponseDTO> {
    return this.http.get<ResponseDTO>(this.baseUrl, { params: { page } });
  }

  getCharacter(id: number): Observable<CharDTO> {
    return this.http.get<CharDTO>(`${this.baseUrl}/${id}`);
  }
}
