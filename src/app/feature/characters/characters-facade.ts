import { inject, Injectable } from '@angular/core';
import { CharactersStore } from '../../core/state/characters-store/characters-store';
import { RequestParams } from '../../api/models/request-params';
import { CharDTO } from '../../api/models/response-dto';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class CharactersFacade {
  charactersStore = inject(CharactersStore);
  snackBar = inject(MatSnackBar);

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
    this.snackBar.open(`${character.name} added to favorites!`, 'Close', { duration: 1000 });
  }
}

