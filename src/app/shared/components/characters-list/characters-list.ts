import { Component, input, output } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CharacterCard } from '../character-card/character-card';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll';
import { CharDTO } from '../../../api/models/response-dto';

@Component({
  selector: 'app-characters-list',
  imports: [MatGridListModule, MatProgressSpinnerModule, CharacterCard, InfiniteScrollDirective],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
})
export class CharactersList {
  characters = input.required<CharDTO[]>();
  loading = input<boolean>(false);

  viewDetails = output<CharDTO>();
  loadMore = output<void>();
  addToFavorites = output<CharDTO>();
  deleteCharacter = output<CharDTO>();

  onViewDetails(character: CharDTO) {
    this.viewDetails.emit(character);
  }

  onAddToFavorites(character: CharDTO) {
    this.addToFavorites.emit(character);
  }

  onDelete(character: CharDTO) {
    this.deleteCharacter.emit(character);
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
