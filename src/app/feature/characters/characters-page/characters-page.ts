import { ChangeDetectionStrategy, Component, effect, inject, Signal, untracked } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { CharactersFacade } from '../characters-facade';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CharDTO } from '../../../api/models/response-dto';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { RestoreScrollPosition } from '../../../shared/directives/restore-scroll-position';
import { CharactersList } from '../../../shared/components/characters-list/characters-list';
import { EditCharacter } from '../edit-character/edit-character';

@Component({
  selector: 'app-characters',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    RestoreScrollPosition,
    CharactersList
  ],
  templateUrl: './characters-page.html',
  styleUrl: './characters-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersPage {
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly charactersFacade = inject(CharactersFacade);
  private readonly dialog = inject(MatDialog);

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

  addToFavorites(character: CharDTO) {
    this.charactersFacade.addToFavorites(character);
  }

  deleteCharacter(character: CharDTO) {
    this.charactersFacade.deleteCharacter(character);
  }

  editCharacter(character: CharDTO) {
    const dialogRef = this.dialog.open(EditCharacter, {
      data: { ...character }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.charactersFacade.updateCharacter({ ...character, ...result });
      }
    });
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
