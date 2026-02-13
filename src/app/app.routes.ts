import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./feature/characters/characters.routes').then(m => m.charactersRoutes)
  }
];
