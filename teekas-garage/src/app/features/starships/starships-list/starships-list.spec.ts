import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StarshipsListComponent } from './starships-list';
import { StarshipsService } from '../../../core/services/starships.service';
import { StarshipsResponse } from '../../../core/models/starships';

describe('StarshipsListComponent (smoke with mocked service)', () => {
  let component: StarshipsListComponent;
  let fixture: ComponentFixture<StarshipsListComponent>;

  const sampleResponse: StarshipsResponse = {
    count: 0,
    next: null,
    previous: null,
    results: []
  };

  const mockStarshipsService: Partial<StarshipsService> = {
    getStarships: () => of(sampleResponse)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarshipsListComponent],
      providers: [{provide: StarshipsService, useValue: mockStarshipsService}]
    }).compileComponents();

    fixture = TestBed.createComponent(StarshipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
