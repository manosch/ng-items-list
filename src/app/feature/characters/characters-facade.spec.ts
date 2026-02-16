import { CharactersStore } from './../../core/state/characters-store/characters-store';
import { TestBed } from '@angular/core/testing';
import { UPDATED_STORAGE_KEY, DELETED_STORAGE_KEY } from './constants';
import { CharDTO } from '../../api/models/response-dto';
import { CharactersFacade } from './characters-facade';
import { provideZonelessChangeDetection } from '@angular/core';
import { RequestParams } from '../../api/models/request-params';
import { LocalStorage } from '../../core/services/local-storage';

describe('CharactersFacade', () => {
  let facade: CharactersFacade;

  let store: jasmine.SpyObj<InstanceType<typeof CharactersStore>>;


  let localStorage: jasmine.SpyObj<Pick<LocalStorage, 'getItem' | 'setItem'>>;

  const getChar = (args: Partial<CharDTO> = {}): CharDTO =>
    ({
      id: 1,
      name: 'Rick Sanchez',
      ...args,
    } as CharDTO);

  beforeEach(() => {
    store = jasmine.createSpyObj('CharactersStore', [
      'fetchCharacters',
      'resetList',
      'setCurrentPage',
      'currentPage',
      'addToFavorites',
      'updateCharacter',
      'deleteCharacter',
      'removeFromFavorites',
    ]);

    localStorage = jasmine.createSpyObj('LocalStorage', ['getItem', 'setItem']);

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        CharactersFacade,
        { provide: CharactersStore, useValue: store },
        { provide: LocalStorage, useValue: localStorage },
      ],
    });

    facade = TestBed.inject(CharactersFacade);
  });

  it('should create', () => {
    expect(facade).toBeTruthy();
  });

  describe('loadCharacters', () => {
    it('should call store.fetchCharacters with params', () => {
      const params = { name: 'rick' } as Omit<RequestParams, 'page'>;
      facade.loadCharacters(params);
      expect(store.fetchCharacters).toHaveBeenCalledWith(params);
    });
  });

  describe('addToFavorites', () => {
    it('should add character to favorites', () => {
      const char = getChar({ id: 10, name: 'Morty' });

      facade.addToFavorites(char);

      expect(store.addToFavorites).toHaveBeenCalledWith(char);
    });
  });

  describe('updateCharacter', () => {
    it('should update in store, upsert local storage', () => {
      const updated = getChar({ id: 1, name: 'Rick Updated' });

      const existing: CharDTO[] = [getChar({ id: 1, name: 'Old' }), getChar({ id: 2, name: 'Other' })];
      localStorage.getItem.and.callFake((key: string) => {
        if (key === UPDATED_STORAGE_KEY) return existing;
        return null as any;
      });

      facade.updateCharacter(updated);

      expect(store.updateCharacter).toHaveBeenCalledWith(updated);
      expect(localStorage.setItem).toHaveBeenCalledWith(
        UPDATED_STORAGE_KEY,
        jasmine.arrayWithExactContents([updated, existing[1]])
      );
    });
  });

  describe('deleteCharacter', () => {
    it('should call the delete methods with the correct data', () => {
      const char = getChar({ id: 7, name: 'Jerry' });

      const storedDeleted = [1, 2];
      const storedUpdates: CharDTO[] = [
        getChar({ id: 7, name: 'Jerry Old' }),
        getChar({ id: 8, name: 'Other' }),
      ];

      localStorage.getItem.and.callFake((key: string) => {
        if (key === DELETED_STORAGE_KEY) return storedDeleted;
        if (key === UPDATED_STORAGE_KEY) return storedUpdates;
        return null as any;
      });

      facade.deleteCharacter(char);

      expect(store.deleteCharacter).toHaveBeenCalledWith(char);

      expect(localStorage.setItem).toHaveBeenCalledWith(DELETED_STORAGE_KEY, [...storedDeleted, 7]);

      expect(store.removeFromFavorites).toHaveBeenCalledWith(7);

      expect(localStorage.setItem).toHaveBeenCalledWith(UPDATED_STORAGE_KEY, [storedUpdates[1]]);

    });
  });
});
