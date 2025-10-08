import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})

export class LoginComponent {

  mode = signal<'login' | 'register'>('login');
  loading = signal<boolean>(false);
  error = signal<string |null>(null);

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
      this.form = this.fb.group({
        name: [''],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
      });
  }

  switchMode() {
    this.mode.set(this.mode() === 'login' ? 'register' : 'login');
    this.error.set(null);
  }

  async submit() {
    this.form.markAllAsTouched();
    this.error.set(null);

    if (this.form.invalid) return;

    this.loading.set(true);
    try {
      const {name, email, password } = this.form.value;

      if (!email || !password) throw new Error ('Missing credentials');
      if(this.mode() === 'register') {
        if(!name) throw new Error ('Name is required');
        await this.auth.register(name, email, password);
      } else {
        await this.auth.login(email, password);
      }

      this.router.navigate(['/starships']);
    } catch (e: any) {

      const code = e?.code as string | undefined;
      if (code === 'auth/email-already-in-use'){
        this.error.set('This email is already registered');
      } else if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        this.error.set('Invalid email or password');
      } else if (code === 'auth/user-not-found') {
        this.error.set('No account found with this email.');
      } else {
        this.error.set(e?.message ?? 'Unexpected error');
      }
    } finally {
      this.loading.set(false);
    }
  }

}
