import { TestBed } from '@angular/core/testing';

import { CharacterApiTs } from './character-api.ts';

describe('CharacterApiTs', () => {
  let service: CharacterApiTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharacterApiTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
