import { inject, Injectable } from '@angular/core';
import { CharactersStore } from '../../core/state/characters-store/characters-store';
import { RequestParams } from '../../api/models/request-params';
import { CharDTO } from '../../api/models/response-dto';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { DELETED_STORAGE_KEY, FAVORITES_STORAGE_KEY, UPDATED_STORAGE_KEY } from './constants';

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

  updateCharacter(updatedCharacter: CharDTO) {
    this.charactersStore.updateCharacter(updatedCharacter);

    const storedUpdates = this.localStorage.getItem<CharDTO[]>(UPDATED_STORAGE_KEY) ?? [];
    const existingIndex = storedUpdates.findIndex(c => c.id === updatedCharacter.id);
    if (existingIndex >= 0) {
      storedUpdates[existingIndex] = updatedCharacter;
    } else {
      storedUpdates.push(updatedCharacter);
    }
    this.localStorage.setItem(UPDATED_STORAGE_KEY, storedUpdates);

    const updatedFavorites = this.charactersStore.favoriteCharacters();
    this.localStorage.setItem(FAVORITES_STORAGE_KEY, updatedFavorites);

    this.snackBar.open(`${updatedCharacter.name} updated!`, 'Close', { duration: 1000 });
  }

  deleteCharacter(character: CharDTO) {
    this.charactersStore.deleteCharacter(character);
    const deletedCharacters = this.localStorage.getItem<number[]>(DELETED_STORAGE_KEY) ?? [];
    this.localStorage.setItem(DELETED_STORAGE_KEY, [...deletedCharacters, character.id]);

    this.charactersStore.removeFromFavorites(character.id);
    const updatedFavorites = this.charactersStore.favoriteCharacters();
    this.localStorage.setItem(FAVORITES_STORAGE_KEY, updatedFavorites);

    this.snackBar.open(`${character.name} deleted!`, 'Close', { duration: 1000 });
  }
}

