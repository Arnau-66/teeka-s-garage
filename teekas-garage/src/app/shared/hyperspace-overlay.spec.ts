import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperspaceOverlay } from './hyperspace-overlay';

describe('HyperspaceOverlay', () => {
  let component: HyperspaceOverlay;
  let fixture: ComponentFixture<HyperspaceOverlay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HyperspaceOverlay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HyperspaceOverlay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
