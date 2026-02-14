import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CharacterDetailFacade } from './character-detail-facade';
import { CharacterStore } from '../../../core/state/character-store/character-store';

@Component({
  selector: 'app-character-detail',
  imports: [
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './character-detail.html',
  styleUrl: './character-detail.scss',
  providers: [CharacterDetailFacade, CharacterStore]
})
export class CharacterDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly characterFacade = inject(CharacterDetailFacade);

  character = this.characterFacade.character;
  loading = this.characterFacade.loading;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.loadCharacter(+id);
    }
  }

  private loadCharacter(id: number) {
    this.characterFacade.getCharacterInfo(id);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
