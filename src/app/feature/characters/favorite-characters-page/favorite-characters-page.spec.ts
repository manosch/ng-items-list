import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriteCharactersPage } from './favorite-characters-page';

describe('FavoriteCharactersPage', () => {
  let component: FavoriteCharactersPage;
  let fixture: ComponentFixture<FavoriteCharactersPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteCharactersPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FavoriteCharactersPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
