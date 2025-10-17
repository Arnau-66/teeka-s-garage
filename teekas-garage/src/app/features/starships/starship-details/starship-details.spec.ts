// 3 tests esenciales. El componente llama en ngOnInit() a fetchDetails() -> starshipsService.getStarshipFullDetails(...)
// Por eso el mock del servicio DEBE exponer getStarshipFullDetails().

import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { StarshipDetailsComponent } from './starship-details';
import { StarshipsService } from '../../../core/services/starships.service';

describe('StarshipDetailsComponent (core tests)', () => {
  let fixture: ComponentFixture<StarshipDetailsComponent>;
  let component: StarshipDetailsComponent;

  // Mock del servicio con el método que usa el componente al iniciar
  const mockStarshipsService = {
    getStarshipFullDetails: jasmine.createSpy('getStarshipFullDetails').and.returnValue(of(null)),
  };

  const mockActivatedRoute = {
    snapshot: { paramMap: convertToParamMap({ id: '9' }) },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarshipDetailsComponent, RouterTestingModule],
      providers: [
        { provide: StarshipsService, useValue: mockStarshipsService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StarshipDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // dispara ngOnInit -> fetchDetails() -> getStarshipFullDetails()
  });

  it('shows loading message when loading() is true', () => {
    spyOn(component as any, 'loading').and.returnValue(true);
    spyOn(component as any, 'error').and.returnValue(null);
    spyOn(component as any, 'starship').and.returnValue(null);
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('p[aria-live="polite"]'));
    expect(loadingEl).not.toBeNull();
    expect(loadingEl.nativeElement.textContent.trim()).toBe('Loading starship...');
  });

  it('shows error block with back link when error() has a message', () => {
    spyOn(component as any, 'loading').and.returnValue(false);
    spyOn(component as any, 'error').and.returnValue('Something went wrong');
    spyOn(component as any, 'starship').and.returnValue(null);
    fixture.detectChanges();

    const block = fixture.debugElement.query(By.css('div.error[role="alert"]'));
    expect(block).not.toBeNull();
    expect(block.nativeElement.textContent).toContain('Ooops! Something went wrong');

    const back = block.query(By.css('a[routerLink="/starships"]'));
    expect(back).not.toBeNull();
    expect(back.nativeElement.textContent.trim()).toBe('Back to list');
  });

  it('renders name, key specs and image when starship() returns data', () => {
    spyOn(component as any, 'loading').and.returnValue(false);
    spyOn(component as any, 'error').and.returnValue(null);
    spyOn(component as any, 'starship').and.returnValue({
      id: 9,
      name: 'Death Star',
      model: 'DS-1 Orbital Battle Station',
      manufacturer: 'Imperial Department of Military Research',
      costInCredits: 1000000000000,
      length: 120000,
      maxAtmospheringSpeed: null,
      crew: '342953',
      passengers: '843342',
      cargoCapacity: '1000000000000',
      consumables: '3 years',
      hyperdriveRating: '4.0',
      mglt: '10',
      starshipClass: 'Deep Space Mobile Battlestation',
      imageUrl: '/img/ships/death-star.png',
      pilots: [],
      films: [],
    });
    fixture.detectChanges();

    const nameEl = fixture.debugElement.query(By.css('.specs h3'));
    expect(nameEl).not.toBeNull();
    expect(nameEl.nativeElement.textContent.trim()).toBe('Death Star');

    const specsText = fixture.debugElement.queryAll(By.css('.specs ul li'))
      .map(li => li.nativeElement.textContent).join(' ');
    expect(specsText).toContain('Model: DS-1 Orbital Battle Station');
    expect(specsText).toContain('Manufacturer: Imperial Department of Military Research');

    const img = fixture.debugElement.query(By.css('.ship-image img'));
    expect(img).not.toBeNull();
    expect((img.nativeElement as HTMLImageElement).getAttribute('src')).toBe('/img/ships/death-star.png');
    expect((img.nativeElement as HTMLImageElement).getAttribute('alt')).toBe('Image of Death Star');
  });
});
