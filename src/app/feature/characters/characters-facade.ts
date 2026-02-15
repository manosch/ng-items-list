import { inject, Injectable } from '@angular/core';
import { CharactersStore } from '../../core/state/characters-store/characters-store';
import { RequestParams } from '../../api/models/request-params';
import { CharDTO } from '../../api/models/response-dto';
import { LocalStorageService } from '../../core/services/local-storage.service';
import { DELETED_STORAGE_KEY, UPDATED_STORAGE_KEY } from './constants';
import { NotificationUtils } from '../../shared/services/notification-utils';

@Injectable({
  providedIn: 'root',
})
export class CharactersFacade {
  charactersStore = inject(CharactersStore);
  notifications = inject(NotificationUtils);
  localStorage = inject(LocalStorageService);

  charactersList = this.charactersStore.characters;
  favoriteCharacters = this.charactersStore.favoriteCharacters;
  loading = this.charactersStore.loading;
  canLoadMore = this.charactersStore.hasMorePages;

  loadCharacters(params: Omit<RequestParams, 'page'>) {
    this.charactersStore.fetchCharacters(params);
  }

  resetList() {
    this.charactersStore.resetList();
  }

  setNextPage() {
    this.charactersStore.setCurrentPage(this.charactersStore.currentPage() + 1);
  }

  addToFavorites(character: CharDTO) {
    this.charactersStore.addToFavorites(character);
    this.notifications.notify(`${character.name} added to favorites!`);
  }

  updateCharacter(updatedCharacter: CharDTO) {
    this.charactersStore.updateCharacter(updatedCharacter);
    this.upsertStoredUpdate(updatedCharacter);
    this.notifications.notify(`${updatedCharacter.name} updated!`);
  }

  deleteCharacter(character: CharDTO) {
    this.charactersStore.deleteCharacter(character);

    const deletedIds = this.localStorage.getItem<number[]>(DELETED_STORAGE_KEY) ?? [];
    this.localStorage.setItem(DELETED_STORAGE_KEY, [...deletedIds, character.id]);

    this.charactersStore.removeFromFavorites(character.id);
    this.removeFromStoredUpdates(character.id);

    this.notifications.notify(`${character.name} deleted!`);
  }

  private upsertStoredUpdate(character: CharDTO) {
    const storedUpdates = this.localStorage.getItem<CharDTO[]>(UPDATED_STORAGE_KEY) ?? [];
    const existingIndex = storedUpdates.findIndex(c => c.id === character.id);
    existingIndex >= 0
      ? storedUpdates[existingIndex] = character
      : storedUpdates.push(character);
    this.localStorage.setItem(UPDATED_STORAGE_KEY, storedUpdates);
  }

  private removeFromStoredUpdates(characterId: number) {
    const storedUpdates = this.localStorage.getItem<CharDTO[]>(UPDATED_STORAGE_KEY) ?? [];
    const updatedList = storedUpdates.filter(c => c.id !== characterId);
    this.localStorage.setItem(UPDATED_STORAGE_KEY, updatedList);
  }
}

