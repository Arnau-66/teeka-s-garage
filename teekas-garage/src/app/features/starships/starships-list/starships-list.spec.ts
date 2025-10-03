import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarshipsList } from './starships-list';

describe('StarshipsList', () => {
  let component: StarshipsList;
  let fixture: ComponentFixture<StarshipsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarshipsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarshipsList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
