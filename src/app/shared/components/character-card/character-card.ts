import { Component, input, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CharDTO } from '../../../api/models/response-dto';

@Component({
  selector: 'app-character-card',
  imports: [MatCardModule, MatButtonModule, MatIconModule, MatMenuModule, NgOptimizedImage],
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss',
})
export class CharacterCard {
  character = input.required<CharDTO>();
  
  edit = output<CharDTO>();
  delete = output<CharDTO>();

  onEdit() {
    this.edit.emit(this.character());
  }

  onDelete() {
    this.delete.emit(this.character());
  }
}
