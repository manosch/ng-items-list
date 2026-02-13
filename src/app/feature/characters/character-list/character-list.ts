import { afterNextRender, Component, effect, ElementRef, inject, Signal, untracked, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, debounceTime, distinctUntilChanged, map, filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CharactersFacade } from './characters-facade.js';
import { CharactersStore } from '../../../state/characters-store/characters-store.js';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CharacterCard } from '../../../shared/components/character-card/character-card.js';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll.js';
import { CharDTO } from '../../../api/models/response-dto';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-character-list',
  imports: [MatGridListModule, CharacterCard, MatProgressSpinnerModule, ReactiveFormsModule, InfiniteScrollDirective, MatFormFieldModule, MatInputModule],
  templateUrl: './character-list.html',
  styleUrl: './character-list.scss',
  providers: [CharactersFacade, CharactersStore]
})
export class CharacterList {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  charactersFacade = inject(CharactersFacade);

  characters = this.charactersFacade.charactersList;
  canLoadMore = this.charactersFacade.canLoadMore;
  loading = this.charactersFacade.loading;
  searchForm = this.fb.nonNullable.group({
    searchTerm: ''
  });
  searchTerm!: Signal<string>;

  constructor() {
    this.searchTerm = toSignal(
      this.searchForm.controls.searchTerm.valueChanges
        .pipe(
          distinctUntilChanged(),
          filter(term => term.trim().length === 0 || term.trim().length > 2),
          debounceTime(300),
        ), { initialValue: '' });

    effect(() => {
      this.searchTerm();
      untracked(() => this.reloadCharacters());
    });
  }

  reloadCharacters() {
    this.charactersFacade.resetList();
    this.loadCharacters();
  }

  loadCharacters() {
    const searchValue = this.searchTerm() ?? '';
    this.charactersFacade.loadCharacters({ name: searchValue });
  }

  loadNextPage() {
    if(this.canLoadMore()) {
      this.charactersFacade.setNextPage();
      this.loadCharacters();
    }
  }

  viewCharacterDetails(character: CharDTO) {
    this.router.navigate(['/', character.id]);
  }
}
