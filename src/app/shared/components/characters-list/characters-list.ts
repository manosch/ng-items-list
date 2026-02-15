import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { CharacterCard } from '../character-card/character-card';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll';
import { CharDTO } from '../../../api/models/response-dto';
import { CharactersFacade } from '../../../feature/characters/characters-facade';
import { EditCharacter } from '../../../feature/characters/edit-character/edit-character';
import { Router } from '@angular/router';

@Component({
  selector: 'app-characters-list',
  imports: [MatGridListModule, MatProgressSpinnerModule, CharacterCard, InfiniteScrollDirective],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersList {
  private readonly charactersFacade = inject(CharactersFacade);
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  characters = input.required<CharDTO[]>();
  loading = input<boolean>(false);

  viewDetails = output<CharDTO>();
  loadMore = output<void>();

  onViewDetails(character: CharDTO) {
    this.router.navigate(['/characters', character.id]);
  }

  onAddToFavorites(character: CharDTO) {
    this.charactersFacade.addToFavorites(character);
  }

  onEditChar(character: CharDTO) {
    const dialogRef = this.dialog.open(EditCharacter, {
      data: { ...character }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.charactersFacade.updateCharacter({ ...character, ...result });
      }
    });
  }

  onDelete(character: CharDTO) {
    this.charactersFacade.deleteCharacter(character);
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
