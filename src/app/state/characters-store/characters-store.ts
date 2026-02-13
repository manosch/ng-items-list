
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, filter, tap } from 'rxjs';
import { CharDTO } from '../../api/models/response-dto';
import { CharacterApi } from '../../api/services/character-api.ts';


type CharactersState = {
  characters: CharDTO[];
  currentPage: number;
  loading: boolean;
}

const initialState: CharactersState = {
  characters: [],
  currentPage: 1,
  loading: false
}

export const CharactersStore = signalStore(
  withState(initialState),
  withProps(() => ({
    api: inject(CharacterApi)
  })),
  withMethods(({ api, ...store }) => ({
    fetchCharacters: rxMethod(
      pipe(
        switchMap(() => {
          patchState(store, { loading: true })
          return api.fetchData(store.currentPage()).pipe(
            tap(response => {
              patchState(store, {
                characters: [...store.characters(), ...response.results],
                currentPage: store.currentPage(),
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
  }))
)
