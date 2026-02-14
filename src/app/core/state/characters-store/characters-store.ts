
import { patchState, signalStore, withComputed, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, filter, tap, catchError } from 'rxjs';
import { CharDTO } from '../../../api/models/response-dto';
import { CharacterApi } from '../../../api/services/character-api.ts';
import { RequestParams } from '../../../api/models/request-params';
import { LocalStorageService } from '../../services/local-storage.service';

const FAVORITES_STORAGE_KEY = 'favorite-characters';

type CharactersState = {
  characters: CharDTO[];
  favoriteCharacters: CharDTO[];
  currentPage: number;
  hasMorePages: boolean;
  loading: boolean;
}

const initialState: CharactersState = {
  characters: [],
  favoriteCharacters: [],
  currentPage: 1,
  hasMorePages: true,
  loading: false
}

export const CharactersStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withProps(() => ({
    api: inject(CharacterApi),
    localStorage: inject(LocalStorageService)
  })),

  withMethods(({ api, localStorage, ...store }) => ({
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
    addToFavorites: (character: CharDTO) => {
      if(store.favoriteCharacters().some(c => c.id === character.id)) {
        return;
      }
      const updatedFavorites = [...store.favoriteCharacters(), character];
      patchState(store, { favoriteCharacters: updatedFavorites });
    },
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
  })),
  withHooks({
    onInit({ localStorage, ...store }) {
      const storedFavorites = localStorage.getItem<CharDTO[]>(FAVORITES_STORAGE_KEY);
      if (storedFavorites && storedFavorites.length > 0) {
        patchState(store, { favoriteCharacters: storedFavorites });
      }
    }
  })
)
