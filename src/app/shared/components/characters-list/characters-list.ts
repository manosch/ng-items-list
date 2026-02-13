import { Component, input, output } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CharacterCard } from '../character-card/character-card.js';
import { InfiniteScrollDirective } from '../../directives/infinite-scroll.js';
import { CharDTO } from '../../../api/models/response-dto.js';

@Component({
  selector: 'app-characters-list',
  imports: [MatGridListModule, MatProgressSpinnerModule, CharacterCard, InfiniteScrollDirective],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
})
export class CharactersList {
  characters = input.required<CharDTO[]>();
  loading = input.required<boolean>();

  viewDetails = output<CharDTO>();
  loadMore = output<void>();

  onViewDetails(character: CharDTO) {
    this.viewDetails.emit(character);
  }

  onLoadMore() {
    this.loadMore.emit();
  }
}
