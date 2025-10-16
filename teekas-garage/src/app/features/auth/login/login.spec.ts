// Importamos utilidades de testing de Angular.
// - TestBed: "banco de pruebas" para configurar el entorno de un componente.
// - ComponentFixture: contenedor que envuelve al componente y su template, permite acceder al DOM renderizado.
// - fakeAsync + flushMicrotasks: nos permiten testear código asíncrono basado en Promises de forma controlada.
import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

// By: utilidad para hacer queries al DOM del fixture (por selectores CSS).
import { By } from '@angular/platform-browser';

// Importamos el componente Standalone que vamos a testear.
// Ojo: en tu proyecto el archivo se llama "./login" y exporta LoginComponent.
import { LoginComponent } from './login';

// Servicios/dep. que el componente INYECTA por constructor y debemos "simular" (mockear).
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

describe('LoginComponent', () => {
  // 'component' será la instancia de la clase LoginComponent (para llamar métodos, leer señales, etc.)
  // 'fixture' es el "wrapper" que contiene el componente + HTML renderizado + utilidades para detectar cambios.
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  // ====== MOCKS ======
  // Creamos un mock (doble de prueba) de AuthService. Usamos jasmine.createSpy para poder afirmar si se llamó.
  // Devolvemos Promises resueltas por defecto para simular éxito sin tocar Firebase real.
  const mockAuth = {
    login: jasmine.createSpy('login').and.returnValue(Promise.resolve()),
    register: jasmine.createSpy('register').and.returnValue(Promise.resolve()),
  };

  // Mock simple de Router. Aquí no navegamos, pero lo inyecta el componente y hay que proveerlo.
  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
  };

  // beforeEach async: se ejecuta antes de CADA test. Preparamos el entorno de pruebas.
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Como LoginComponent es Standalone, basta con incluirlo en imports y él arrastra sus propios imports
      // (CommonModule, ReactiveFormsModule) ya declarados en el @Component.
      imports: [LoginComponent],
      // Proveemos los mocks para las dependencias inyectadas.
      providers: [
        { provide: AuthService, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents(); // Compila las plantillas y prepara el módulo de pruebas.

    // Creamos una instancia "real" del componente bajo prueba dentro del TestBed.
    fixture = TestBed.createComponent(LoginComponent);

    // Obtenemos la referencia a la clase del componente para poder invocar métodos y leer señales.
    component = fixture.componentInstance;

    // Disparamos detección de cambios inicial para que el template se renderice con el estado actual.
    fixture.detectChanges();
  });

  // afterEach: buen hábito para "resetear" contadores de espías tras cada test y evitar contaminaciones entre casos.
  afterEach(() => {
    mockAuth.login.calls.reset();
    mockAuth.register.calls.reset();
    mockRouter.navigate.calls?.reset?.();
  });

  // ========== TEST 1 ==========
  it('should create', () => {
    // Sencillo: comprobamos que la instancia del componente se ha creado correctamente.
    expect(component).toBeTruthy();
  });

  // ========== TEST 2 ==========
  it('should disable submit button when form is invalid', () => {
    // Contexto: el FormGroup exige email requerido y con formato; password requerida y con minlength(6).
    // Al inicio, el formulario está vacío → INVALID.
    fixture.detectChanges(); // Aseguramos que el template está sincronizado.

    // Buscamos el botón de submit por selector CSS en el DOM del fixture.
    const submitBtn: HTMLButtonElement =
      fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;

    // Si el form es inválido, el template tiene [disabled]="loading() || form.invalid"
    // Así que esperamos que esté deshabilitado.
    expect(submitBtn.disabled).toBeTrue();
  });

  // ========== TEST 3 ==========
  it('should show name field only in register mode', () => {
    // Por defecto el modo es 'login' (mode = signal<'login'|'register'>('login')).
    // En el template el campo "name" solo aparece si mode() === 'register'.
    // Revisamos que NO exista el input de name en modo login.
    expect(fixture.debugElement.query(By.css('input[formControlName="name"]'))).toBeNull();

    // Cambiamos el modo llamando al método del componente (esto actualiza la signal 'mode').
    component.switchMode();

    // Detección de cambios para que el nuevo estado se refleje en el DOM.
    fixture.detectChanges();

    // Ahora el campo de name DEBE existir en el DOM.
    expect(fixture.debugElement.query(By.css('input[formControlName="name"]'))).not.toBeNull();
  });

  // ========== TEST 4 ==========
  it('should call auth.login with email & password on submit (login mode)', fakeAsync(() => {
    // Preparamos el formulario con valores válidos en modo login.
    component.form.patchValue({
      email: 'vader@example.com', // email con formato válido
      password: 'deathstar',     // password >= 6 chars
    });

    // Llamamos a submit(). Este método:
    // - marca todo como touched
    // - si inválido: retorna
    // - setea loading(true)
    // - intenta llamar a auth.login(...) (o register en modo 'register')
    // - captura errores y setea error()
    // - finalmente setea loading(false)
    component.submit();

    // IMPORTANTE: submit llama a métodos que devuelven PROMISES (async/await).
    // Con fakeAsync, usamos flushMicrotasks() para avanzar el "microtask queue" y resolver esas Promises.
    flushMicrotasks();

    // Afirmamos que se llamó al mock de login EXACTAMENTE una vez y con los parámetros correctos.
    expect(mockAuth.login).toHaveBeenCalledOnceWith('vader@example.com', 'deathstar');

    // Y que NO se llamó a register (porque seguimos en modo login).
    expect(mockAuth.register).not.toHaveBeenCalled();
  }));

  // ========== TEST 5 ==========
  it('should call auth.register with name, email & password on submit (register mode)', fakeAsync(() => {
    // Cambiamos el modo a 'register' para que submit ejecute la rama de registro.
    component.switchMode();
    fixture.detectChanges();

    // Rellenamos TODOS los campos necesarios para registro (name también es requerido por la lógica).
    component.form.patchValue({
      name: 'Darth Vader',
      email: 'vader@example.com',
      password: 'deathstar',
    });

    // Ejecutamos la acción.
    component.submit();
    flushMicrotasks(); // resolvemos Promises simuladas.

    // Debe haberse llamado a register con name, email y password.
    expect(mockAuth.register).toHaveBeenCalledOnceWith('Darth Vader', 'vader@example.com', 'deathstar');

    // Y NO a login.
    expect(mockAuth.login).not.toHaveBeenCalled();
  }));

  // ========== TEST 6 ==========
  it('should emit authSuccess after successful login', fakeAsync(() => {
    // Espiamos el EventEmitter @Output() para comprobar que emite tras un login correcto.
    spyOn(component.authSuccess, 'emit');

    // Preparamos un form válido (modo login por defecto).
    component.form.patchValue({
      email: 'vader@example.com',
      password: 'deathstar',
    });

    // Ejecutamos submit.
    component.submit();
    flushMicrotasks(); // resolvemos la Promise devuelta por mockAuth.login

    // Si no hubo errores, el componente hace this.authSuccess.emit()
    expect(component.authSuccess.emit).toHaveBeenCalled();
  }));

  // ========== TEST 7 ==========
  it('should set friendly error message for wrong password', fakeAsync(() => {
    // Para simular un error concreto, hacemos que el mock de login devuelva un reject con código Firebase.
    mockAuth.login.and.returnValue(Promise.reject({ code: 'auth/wrong-password' }));

    // Form válido, pero el mock fallará.
    component.form.patchValue({
      email: 'vader@example.com',
      password: 'wrong',
    });

    // Ejecutamos submit y resolvemos microtareas (la Promise rechaza).
    component.submit();
    flushMicrotasks();

    // El catch del componente mapea 'auth/wrong-password' a el mensaje 'Invalid email or password'.
    expect(component.error()).toBe('Invalid email or password');

    // Además, en el template este error se pinta como <p class="error" role="alert">{{ error() }}</p>
    fixture.detectChanges(); // sincronizamos el DOM con el nuevo valor de error()
    const errorEl = fixture.debugElement.query(By.css('p.error[role="alert"]')).nativeElement as HTMLParagraphElement;
    expect(errorEl.textContent?.trim()).toBe('Invalid email or password');
  }));

  // ========== TEST 8 ==========
  it('should require name in register mode and show hint if missing', fakeAsync(() => {
    // Cambiamos a modo registro.
    component.switchMode();
    fixture.detectChanges();

    // Dejamos el 'name' vacío a propósito para verificar la pista (hint) del template.
    component.form.patchValue({
      name: '', // Falta el nombre
      email: 'luke@example.org',
      password: 'theforce',
    });

    // Ejecutamos submit. Internamente:
    // - Si falta name en modo register, el componente arroja un Error('Name is required')
    // - Se captura en el catch y se muestra error genérico si aplica
    // Además, el template tiene una pista condicional para name tocado y vacío.
    component.submit();
    flushMicrotasks();
    fixture.detectChanges();

    // Localizamos el hint del campo name que aparece solo en register + touched + sin valor.
    const hint = fixture.debugElement.query(By.css('small.hint'));
    expect(hint).not.toBeNull();
    expect(hint.nativeElement.textContent.trim()).toBe('Name is required for registration');
  }));
});
