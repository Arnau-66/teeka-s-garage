import { TestBed, ComponentFixture } from '@angular/core/testing';
import { HyperspaceOverlayComponent } from './hyperspace-overlay';

describe('HyperspaceOverlayComponent', () => {
  let fixture: ComponentFixture<HyperspaceOverlayComponent>;
  let component: HyperspaceOverlayComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperspaceOverlayComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HyperspaceOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Añade más tests cuando el overlay tenga @Input() show / @Output() done
  // it('should toggle visibility with @Input() show', () => { ... });
  // it('should emit done on completion', () => { ... });
});
