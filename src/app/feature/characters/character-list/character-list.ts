import { Component, inject } from '@angular/core';
import { CharactersFacade } from '../characters-facade.ts';
import { CharactersStore } from '../../../state/characters-store/characters-store.js';
import {MatGridListModule} from '@angular/material/grid-list';
import { CharacterCard } from '../../../shared/components/character-card/character-card.js';

@Component({
  selector: 'app-character-list',
  imports: [MatGridListModule, CharacterCard],
  templateUrl: './character-list.html',
  styleUrl: './character-list.scss',
  providers: [CharactersFacade, CharactersStore]
})
export class CharacterList {
  charactersFacade = inject(CharactersFacade);

  characters = this.charactersFacade.charactersList;
  loading = this.charactersFacade.loading;

  constructor() {
    this.charactersFacade.loadCharactersPage(1);
  }
}
