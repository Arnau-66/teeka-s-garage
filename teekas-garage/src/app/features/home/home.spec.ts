import { TestBed, ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HomeComponent } from './home';
import { AuthService } from '../../core/services/auth.service';

describe('HomeComponent', () => {
  let fixture: ComponentFixture<HomeComponent>;
  let component: HomeComponent;

  // mock de AuthService para evitar Firebase real
  const mockAuth = {
    login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
    register: jasmine.createSpy('register').and.returnValue(Promise.resolve()),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [{ provide: AuthService, useValue: mockAuth }],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders title and CTA initially (no hyperspace visible)', () => {
    const titleEl = fixture.debugElement.query(By.css('section.home h1'));
    expect(titleEl).not.toBeNull();

    const cta = fixture.debugElement.query(By.css('section.home button.cta'));
    expect(cta).not.toBeNull();

    const overlay = fixture.debugElement.query(By.css('.overlay'));
    expect(overlay).toBeNull();
  });

  it('opens the login dialog when CTA is clicked', () => {
    const cta = fixture.debugElement.query(By.css('section.home button.cta'));
    cta.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.overlay'));
    expect(overlay).not.toBeNull();

    const dialog = fixture.debugElement.query(By.css('#loginDialog[role="dialog"]'));
    expect(dialog).not.toBeNull();
  });

  it('closes the login dialog when clicking on the backdrop', () => {
    const cta = fixture.debugElement.query(By.css('section.home button.cta'));
    cta.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    let overlay = fixture.debugElement.query(By.css('.overlay'));
    expect(overlay).not.toBeNull();

    overlay.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    overlay = fixture.debugElement.query(By.css('.overlay'));
    expect(overlay).toBeNull();
  });

  it('hides dialog after app-login emits authSuccess', () => {
    const cta = fixture.debugElement.query(By.css('section.home button.cta'));
    cta.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();

    const loginDe = fixture.debugElement.query(By.css('app-login'));
    expect(loginDe).not.toBeNull();

    loginDe.triggerEventHandler('authSuccess', undefined);
    fixture.detectChanges();

    const overlay = fixture.debugElement.query(By.css('.overlay'));
    expect(overlay).toBeNull();

    // Si el overlay de hyperspace depende de una signal show, aquí podrías comprobarla:
    // const hs = fixture.debugElement.query(By.css('app-hyperspace-overlay'));
    // expect(hs).not.toBeNull();
  });
});
