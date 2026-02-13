import { afterNextRender, Component, effect, ElementRef, inject, Signal, untracked, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fromEvent, debounceTime, distinctUntilChanged, map, filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CharactersFacade } from './characters-facade.js';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CharacterCard } from '../../../shared/components/character-card/character-card.js';
import { InfiniteScrollDirective } from '../../../shared/directives/infinite-scroll.js';
import { CharDTO } from '../../../api/models/response-dto';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RestoreScrollPosition } from '../../../shared/directives/restore-scroll-position.js';

@Component({
  selector: 'app-character-list',
  imports: [
    MatGridListModule,
    CharacterCard,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    InfiniteScrollDirective,
    MatFormFieldModule,
    MatInputModule,
    RestoreScrollPosition
  ],
  templateUrl: './character-list.html',
  styleUrl: './character-list.scss'
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
  isInitialLoad = false;

  constructor() {
    this.searchTerm = toSignal(
      this.searchForm.controls.searchTerm.valueChanges
        .pipe(
          distinctUntilChanged(),
          filter(term =>
            term.trim().length === 0 || term.trim().length > 2
          ),
          debounceTime(300),
        ), { initialValue: '' }
      );

    // Initial load: only load if state is empty
    if (this.characters().length === 0) {
      this.loadCharacters();
    }

    effect(() => {
      this.searchTerm();
      untracked(() => {
        if (this.isInitialLoad) {
          this.reloadCharacters();
        }
      });
      this.isInitialLoad = true;
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
    if (this.canLoadMore()) {
      this.charactersFacade.setNextPage();
      this.loadCharacters();
    }
  }

  viewCharacterDetails(character: CharDTO) {
    this.router.navigate(['/characters', character.id]);
  }
}
