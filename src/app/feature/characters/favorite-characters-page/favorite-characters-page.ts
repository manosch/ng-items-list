import { CharactersList } from '../../../shared/components/characters-list/characters-list';
import { CharactersFacade } from './../characters-facade';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

@Component({
  selector: 'app-favorite-characters-page',
  imports: [CharactersList],
  templateUrl: './favorite-characters-page.html',
  styleUrl: './favorite-characters-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoriteCharactersPage {
  charactersFacade = inject(CharactersFacade);

  favoriteCharacters = this.charactersFacade.favoriteCharacters;
}
