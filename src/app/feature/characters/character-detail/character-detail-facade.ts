import { inject, Injectable } from '@angular/core';
import { CharacterStore } from '../../../state/character-store/character-store';

export class CharacterDetailFacade {
  characterStore = inject(CharacterStore);

  character = this.characterStore.characterInfo;
  loading = this.characterStore.loading;


  getCharacterInfo(id: number) {
    this.characterStore.fetchCharacter({ id });
  }
}
