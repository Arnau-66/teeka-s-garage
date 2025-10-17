import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { StarshipsListComponent } from './starships-list';
import { StarshipsService } from '../../../core/services/starships.service';

describe('StarshipsListComponent (core UI tests)', () => {
  let fixture: ComponentFixture<StarshipsListComponent>;
  let component: StarshipsListComponent;

  // Mock con método requerido por ngOnInit/fetchPage
  const mockStarshipsService = {
    getStarships: jasmine.createSpy('getStarships').and.returnValue(
      of({ count: 0, next: null, previous: null, results: [] })
    ),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarshipsListComponent, RouterTestingModule],
      providers: [{ provide: StarshipsService, useValue: mockStarshipsService }],
    }).compileComponents();

    fixture = TestBed.createComponent(StarshipsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ngOnInit -> fetchPage(1) -> getStarships()
  });

  it('shows loading paragraph when loading() is true', () => {
    spyOn(component as any, 'loading').and.returnValue(true);
    spyOn(component as any, 'error').and.returnValue(null);
    spyOn(component as any, 'starships').and.returnValue([]);
    fixture.detectChanges();

    const loadingEl = fixture.debugElement.query(By.css('p[aria-live="polite"]'));
    expect(loadingEl).not.toBeNull();
    expect(loadingEl.nativeElement.textContent.trim()).toBe('Loading starships...');
  });

  it('shows error block and clicking Retry calls fetchPage(1)', () => {
    spyOn(component as any, 'loading').and.returnValue(false);
    spyOn(component as any, 'error').and.returnValue('Network down');
    spyOn(component as any, 'starships').and.returnValue([]);
    spyOn(component as any, 'fetchPage').and.stub();
    fixture.detectChanges();

    const errorBlock = fixture.debugElement.query(By.css('div.error[role="alert"]'));
    expect(errorBlock).not.toBeNull();

    const retryBtn = errorBlock.query(By.css('button.sw-btn'));
    expect(retryBtn).not.toBeNull();

    retryBtn.triggerEventHandler('click', new MouseEvent('click'));
    expect((component as any).fetchPage).toHaveBeenCalledOnceWith(1);
  });

  it('renders holo image + caption and shows a "View Details" link when there is an active ship', () => {
    spyOn(component as any, 'loading').and.returnValue(false);
    spyOn(component as any, 'error').and.returnValue(null);
    spyOn(component as any, 'starships').and.returnValue([
      { name: 'X-wing', url: 'https://swapi.dev/api/starships/12/' },
      { name: 'Y-wing', url: 'https://swapi.dev/api/starships/13/' },
    ]);
    spyOn(component as any, 'activeIndex').and.returnValue(0);
    spyOn(component as any, 'shipImageFrom').and.returnValue('/img/ships/x-wing.png');
    // Nota: no comprobamos routerLink reflejado (puede no estar). Solo que el CTA exista.
    fixture.detectChanges();

    const holoImg = fixture.debugElement.query(By.css('.holo-stage img'));
    expect(holoImg).not.toBeNull();
    expect((holoImg.nativeElement as HTMLImageElement).getAttribute('src')).toBe('/img/ships/x-wing.png');

    const caption = fixture.debugElement.query(By.css('.holo-caption.aurebesh'));
    expect(caption).not.toBeNull();
    expect(caption.nativeElement.textContent.trim()).toBe('X-wing');

    const detailsBtn = fixture.debugElement.query(By.css('a.sw-btn.details-button'));
    expect(detailsBtn).not.toBeNull(); // existe el enlace de detalles
  });

  it('clicking carousel buttons calls goNextInCarousel() / goPrevInCarousel()', () => {
    spyOn(component as any, 'loading').and.returnValue(false);
    spyOn(component as any, 'error').and.returnValue(null);
    spyOn(component as any, 'starships').and.returnValue([
      { name: 'X-wing', url: 'https://swapi.dev/api/starships/12/' },
      { name: 'Y-wing', url: 'https://swapi.dev/api/starships/13/' },
    ]);
    spyOn(component as any, 'activeIndex').and.returnValue(0);
    spyOn(component as any, 'goNextInCarousel').and.stub();
    spyOn(component as any, 'goPrevInCarousel').and.stub();
    fixture.detectChanges();

    const prevBtn = fixture.debugElement.query(By.css('button.car-btn--prev'));
    const nextBtn = fixture.debugElement.query(By.css('button.car-btn--next'));
    expect(prevBtn).not.toBeNull();
    expect(nextBtn).not.toBeNull();

    nextBtn.triggerEventHandler('click', new MouseEvent('click'));
    expect((component as any).goNextInCarousel).toHaveBeenCalled();

    (component as any).activeIndex.and.returnValue(1);
    fixture.detectChanges();
    prevBtn.triggerEventHandler('click', new MouseEvent('click'));
    expect((component as any).goPrevInCarousel).toHaveBeenCalled();
  });
});
