import { Routes } from '@angular/router';

export const charactersRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./character-list/character-list').then(m => m.CharacterList)
  },
  {
    path: ':id',
    loadComponent: () => import('./character-detail/character-detail').then(m => m.CharacterDetail)
  }
];
