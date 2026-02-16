import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../models/response-dto';
import { RequestParams } from '../models/request-params';

@Injectable({
  providedIn: 'root',
})
export class CharacterApi {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://rickandmortyapi.com/api/character';

  fetchCharacters(params: RequestParams): Observable<ResponseDTO> {
    let httpParams = new HttpParams().set('page', params.page.toString());
    if (params.name) {
      httpParams = httpParams.set('name', params.name);
    }
    return this.http.get<ResponseDTO>(this.baseUrl, { params: httpParams });
  }
}
