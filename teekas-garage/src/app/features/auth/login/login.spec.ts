import { ComponentFixture, TestBed, fakeAsync, flush } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { LoginComponent } from './login';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent (minimal, stable)', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // Mocks con Promises (como en producción)
  const mockAuth = {
    login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
    register: jasmine.createSpy('register').and.returnValue(Promise.resolve()),
  };
  const mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ⛑️ MUY IMPORTANTE: restaurar SIEMPRE el comportamiento por defecto del spy
  // porque otros tests pueden haberlo cambiado a .and.returnValue(Promise.reject(...))
  beforeEach(() => {
    mockAuth.login.and.returnValue(Promise.resolve());
    mockAuth.register.and.returnValue(Promise.resolve());
    mockAuth.login.calls.reset();
    mockAuth.register.calls.reset();
  });

  it('creates and disables submit when form invalid', () => {
    expect(component).toBeTruthy();
    const submitBtn = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement as HTMLButtonElement;
    expect(component.form.invalid).toBeTrue();
    expect(submitBtn.disabled).toBeTrue();
  });

  it('calls auth.login and emits authSuccess on successful submit (login mode)', fakeAsync(() => {
    component.mode.set('login');
    component.error.set(null);

    const emitSpy = spyOn(component.authSuccess, 'emit');

    component.form.patchValue({ email: 'user@example.com', password: 'secret123' });
    expect(component.form.valid).toBeTrue();

    component.submit();
    flush();              // drena el async/await interno
    fixture.detectChanges();

    expect(mockAuth.login).toHaveBeenCalledOnceWith('user@example.com', 'secret123');
    expect(emitSpy).toHaveBeenCalled(); // ✅ ahora sí
  }));

  it('shows friendly error for wrong password', fakeAsync(() => {
    // Este test CAMBIA el comportamiento del spy a reject, pero el beforeEach siguiente lo restaurará
    mockAuth.login.and.returnValue(Promise.reject({ code: 'auth/wrong-password' }));

    component.mode.set('login');
    component.error.set(null);

    component.form.patchValue({ email: 'user@example.com', password: 'wrongpwd' });
    expect(component.form.valid).toBeTrue();

    component.submit();
    flush();              // procesa el reject y el catch del componente
    fixture.detectChanges();

    expect(component.error()).toBe('Invalid email or password');

    const errorDe = fixture.debugElement.query(By.css('p.error[role="alert"]'));
    expect(errorDe).not.toBeNull();
    expect((errorDe.nativeElement as HTMLElement).textContent!.trim())
      .toBe('Invalid email or password');
  }));
});
