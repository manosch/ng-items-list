
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, filter, tap, catchError } from 'rxjs';
import { CharDTO } from '../../api/models/response-dto';
import { CharacterApi } from '../../api/services/character-api.ts';
import { RequestParams } from '../../api/models/request-params';


type CharactersState = {
  characters: CharDTO[];
  currentPage: number;
  hasMorePages: boolean;
  loading: boolean;
}

const initialState: CharactersState = {
  characters: [],
  currentPage: 1,
  hasMorePages: true,
  loading: false
}

export const CharactersStore = signalStore(
  withState(initialState),
  withProps(() => ({
    api: inject(CharacterApi)
  })),
  withMethods(({ api, ...store }) => ({
    fetchCharacters: rxMethod<Omit<RequestParams, 'page'>>(
      pipe(
        filter(() => store.hasMorePages()),
        switchMap((params) => {
          patchState(store, { loading: true })
          const completeParams = {
            page: store.currentPage(),
            name: params.name
          }
          return api.fetchCharacters(completeParams).pipe(
            catchError(err => {
              patchState(store, { loading: false });
              return [];
            }),
            tap(response => {
              const newCharacters = [...store.characters(), ...response.results];
              patchState(store, {
                characters: newCharacters,
                currentPage: store.currentPage(),
                hasMorePages: response.info.count > newCharacters.length,
                loading: false
              })
            })
          )
        })
      )
    ),
    setCurrentPage: (page: number) => {
      patchState(store, { currentPage: page });
    },
    resetList: () => {
      patchState(store, {
        characters: [],
        currentPage: 1,
        hasMorePages: true,
        loading: false
      });
    }
  }))
)
