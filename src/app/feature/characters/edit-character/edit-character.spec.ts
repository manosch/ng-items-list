import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCharacter } from './edit-character';

describe('EditCharacter', () => {
  let component: EditCharacter;
  let fixture: ComponentFixture<EditCharacter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCharacter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCharacter);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
