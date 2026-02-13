import { Component, input } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CharDTO } from '../../../api/models/response-dto';

@Component({
  selector: 'app-character-card',
  imports: [MatCardModule, MatButtonModule, NgOptimizedImage],
  templateUrl: './character-card.html',
  styleUrl: './character-card.scss',
})
export class CharacterCard {
  character = input.required<CharDTO>();
}
