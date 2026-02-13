import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersFacade } from './characters-facade.js';
import { CharactersStore } from '../../../state/characters-store/characters-store.js';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CharacterCard } from '../../../shared/components/character-card/character-card.js';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll.js';
import { CharDTO } from '../../../api/models/response-dto';

@Component({
  selector: 'app-character-list',
  imports: [MatGridListModule, CharacterCard, MatProgressSpinnerModule, InfiniteScrollDirective],
  templateUrl: './character-list.html',
  styleUrl: './character-list.scss',
  providers: [CharactersFacade, CharactersStore]
})
export class CharacterList {
  private readonly router = inject(Router);

  charactersFacade = inject(CharactersFacade);

  characters = this.charactersFacade.charactersList;
  loading = this.charactersFacade.loading;

  constructor() {
    this.charactersFacade.loadCharactersPage(1);
  }

  loadNextPage() {
    this.charactersFacade.loadCharactersPage(this.charactersFacade.charactersStore.currentPage() + 1);
  }

  viewCharacterDetails(character: CharDTO) {
    this.router.navigate(['/', character.id]);
  }
}
