
import { patchState, signalStore, withHooks, withMethods, withProps, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { inject } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, filter, tap, catchError, map } from 'rxjs';
import { CharDTO } from '../../../api/models/response-dto';
import { CharacterApi } from '../../../api/services/character-api.ts';
import { RequestParams } from '../../../api/models/request-params';
import { LocalStorageService } from '../../services/local-storage.service';
import { DELETED_STORAGE_KEY, FAVORITES_STORAGE_KEY } from '../../../feature/characters/constants';

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
            map(response => {
              const deletedIds = localStorage.getItem<CharDTO[]>(DELETED_STORAGE_KEY)?.map(c => c.id) ?? [];
              return {
                ...response,
                results: response.results.filter(char => !deletedIds.includes(char.id))
              };
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
      const existingFavorites = store.favoriteCharacters();
      if(existingFavorites.some(c => c.id === character.id)) {
        return;
      }
      const updatedFavorites = [...existingFavorites, character];
      patchState(store, { favoriteCharacters: updatedFavorites });
    },
    removeFromFavorites: (character: CharDTO) => {
      const existingFavorites = store.favoriteCharacters();
      if(!existingFavorites.some(c => c.id === character.id)) {
        return;
      }
      const updatedFavorites = existingFavorites.filter(c => c.id !== character.id);
      patchState(store, { favoriteCharacters: updatedFavorites });
    },
    setCurrentPage: (page: number) => {
      patchState(store, { currentPage: page });
    },
    deleteCharacter: (character: CharDTO) => {
      const updatedCharacters = store.characters().filter(c => c.id !== character.id);
      patchState(store, {characters: updatedCharacters });
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
