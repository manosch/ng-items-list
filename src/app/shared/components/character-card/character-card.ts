import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CharDTO } from '../../../api/models/response-dto';

@Component({
  selector: 'app-character-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule],
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterCard {
  character = input.required<CharDTO>();

  viewDetails = output<CharDTO>();
  edit = output<CharDTO>();
  delete = output<CharDTO>();
  addToFavorites = output<CharDTO>();

  onCardClick() {
    this.viewDetails.emit(this.character());
  }

  onAddToFavorites() {
    this.addToFavorites.emit(this.character());
  }

  onEdit() {
    this.edit.emit(this.character());
  }

  onDelete() {
    this.delete.emit(this.character());
  }
}
