import { inject, Injectable } from '@angular/core';
import { CharactersStore } from '../../core/state/characters-store/characters-store';
import { RequestParams } from '../../api/models/request-params';
import { CharDTO } from '../../api/models/response-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { DELETED_STORAGE_KEY, FAVORITES_STORAGE_KEY } from './constants';

@Injectable({
  providedIn: 'root',
})
export class CharactersFacade {
  charactersStore = inject(CharactersStore);
  snackBar = inject(MatSnackBar);
  localStorage = inject(LocalStorageService);

  charactersList = this.charactersStore.characters;
  favoriteCharacters = this.charactersStore.favoriteCharacters;
  loading = this.charactersStore.loading;
  canLoadMore = this.charactersStore.hasMorePages;

  loadCharacters(params: Omit<RequestParams, 'page'>) {
    this.charactersStore.fetchCharacters(params);
  }

  resetList() {
    this.charactersStore.resetList();
  }

  setNextPage() {
    this.charactersStore.setCurrentPage(this.charactersStore.currentPage() + 1);
  }

  addToFavorites(character: CharDTO) {
    this.charactersStore.addToFavorites(character);
    const updatedFavorites = this.charactersStore.favoriteCharacters();
    this.localStorage.setItem(FAVORITES_STORAGE_KEY, updatedFavorites);

    this.snackBar.open(`${character.name} added to favorites!`, 'Close', { duration: 1000 });
  }

  deleteCharacter(character: CharDTO) {
    this.charactersStore.deleteCharacter(character);
    const deletedCharacters = this.localStorage.getItem<CharDTO[]>(DELETED_STORAGE_KEY) ?? [];
    this.localStorage.setItem(DELETED_STORAGE_KEY, [...deletedCharacters, character]);

    this.charactersStore.removeFromFavorites(character);
    const updatedFavorites = this.charactersStore.favoriteCharacters();
    this.localStorage.setItem(FAVORITES_STORAGE_KEY, updatedFavorites);

    this.snackBar.open(`${character.name} deleted!`, 'Close', { duration: 1000 });
  }
}

