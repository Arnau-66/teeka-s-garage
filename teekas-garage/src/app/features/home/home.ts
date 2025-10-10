import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})


export class HomeComponent {
  showLogin = signal(false);
  hyperspace = signal(false);

  constructor(private router: Router) {}

  openLogin()  { this.showLogin.set(true); document.body.style.overflow = 'hidden'; }
  closeLogin() { this.showLogin.set(false); document.body.style.overflow = ''; }

  @HostListener('document:keydown.escape')
  onEsc(){
    if (this.showLogin()) this.closeLogin();
  }

  onAuthSuccess() {
    this.closeLogin();               // cierra el modal
    this.hyperspace.set(true);       // muestra overlay-animación

    // deja que la animación corra y navega al final
    setTimeout(() => {
      this.router.navigate(['/starships']);
      // opcional: ocultar overlay justo después
      setTimeout(() => this.hyperspace.set(false), 50);
    }, 900); // debe coincidir con la duración CSS
  }
}
