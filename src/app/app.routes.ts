import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'characters',
    loadComponent: async () => (await import('./feature/characters/characters-page/characters-page')).CharactersPage
  },
  {
    path: 'characters/:id',
    loadComponent: async () => (await (import('./feature/characters/character-detail/character-detail'))).CharacterDetail,
  },
  {
    path: '**',
    redirectTo: 'characters',
    pathMatch: 'full'
  },
  {
    path: '',
    redirectTo: 'characters',
    pathMatch: 'full'
  }
];
