import { inject, Injectable } from '@angular/core';
import { CharactersStore } from '../../../state/characters-store/characters-store';
import { RequestParams } from '../../../api/models/request-params';

@Injectable({
  providedIn: 'root',
})
export class CharactersFacade {
  charactersStore = inject(CharactersStore);

  charactersList = this.charactersStore.characters;
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
}

