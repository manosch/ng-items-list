import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { CharDTO } from '../../../api/models/response-dto';
import { CharactersFacade } from '../characters-facade';

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
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly charactersFacade = inject(CharactersFacade);

  character = signal<CharDTO | null>(null);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id !== null && Number.isInteger(+id) && this.charactersFacade.charactersList().length > 0) {
      this.character.set(this.charactersFacade.charactersList().find(c => c.id === +id) ?? null);
    } else {
      this.goBack();
    }
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
