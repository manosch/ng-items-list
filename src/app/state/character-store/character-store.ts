
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, filter, tap, catchError } from 'rxjs';
import { CharDTO } from '../../api/models/response-dto';
import { CharacterApi } from '../../api/services/character-api.ts';


type CharactersState = {
  characterInfo: CharDTO | null;
  loading: boolean;
}

const initialState: CharactersState = {
  characterInfo: null,
  loading: false
}

export const CharacterStore = signalStore(
  withState(initialState),
  withProps(() => ({
    api: inject(CharacterApi)
  })),
  withMethods(({ api, ...store }) => ({
    fetchCharacter: rxMethod<{ id: number }>(
      pipe(
        switchMap(({ id }) => {
          patchState(store, { loading: true })
          return api.getCharacter(id).pipe(
            catchError(err => {
              patchState(store, { loading: false });
              return [];
            }),
            tap(response => {
              patchState(store, {
                characterInfo: response,
                loading: false
              })
            })
          )
        })
      )
    ),
  }))
)
