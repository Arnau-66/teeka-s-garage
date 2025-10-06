import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarshipDetails } from './starship-details';

describe('StarshipDetails', () => {
  let component: StarshipDetails;
  let fixture: ComponentFixture<StarshipDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarshipDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarshipDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
