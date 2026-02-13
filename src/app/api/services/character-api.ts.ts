import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../models/response-dto';

@Injectable({
  providedIn: 'root',
})
export class CharacterApi {
  http = inject(HttpClient)

  fetchData(page: number): Observable<ResponseDTO> {
    return this.http.get<ResponseDTO>('https://rickandmortyapi.com/api/character', { params: { page } })
  }
}
