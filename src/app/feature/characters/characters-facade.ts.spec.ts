import { TestBed } from '@angular/core/testing';

import { CharactersFacadeTs } from './characters-facade.ts';

describe('CharactersFacadeTs', () => {
  let service: CharactersFacadeTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CharactersFacadeTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
