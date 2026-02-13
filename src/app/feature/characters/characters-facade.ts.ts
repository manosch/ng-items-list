import { inject, Injectable } from '@angular/core';
import { CharactersStore } from '../../state/characters-store/characters-store';

@Injectable({
  providedIn: 'root',
})
export class CharactersFacade {
  charactersStore = inject(CharactersStore);

  charactersList = this.charactersStore.characters;
  loading = this.charactersStore.loading;
  

  loadCharactersPage(page: number) {
    this.charactersStore.setCurrentPage(page);
    this.charactersStore.fetchCharacters(page);
  }
}

