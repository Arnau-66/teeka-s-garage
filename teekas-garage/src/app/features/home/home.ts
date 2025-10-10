import { Component, HostListener, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login';
import { Router } from '@angular/router';
import { HyperspaceOverlayComponent } from '../../shared/hyperspace-overlay';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent, HyperspaceOverlayComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})


export class HomeComponent {
  showLogin = signal(false);
  hyperspace = signal(false);

  @ViewChild(HyperspaceOverlayComponent) overlay?: HyperspaceOverlayComponent;

  constructor(private router: Router) {}

  openLogin()  { this.showLogin.set(true); document.body.style.overflow = 'hidden'; }
  closeLogin() { this.showLogin.set(false); document.body.style.overflow = ''; }

  @HostListener('document:keydown.escape')
  onEsc(){
    if (this.showLogin()) this.closeLogin();
  }

  onAuthSuccess() {
    // oculta textos/CTA
    document.documentElement.classList.add('hide-home-ui');

    // cierra modal y muestra overlay
    this.closeLogin();
    this.hyperspace.set(true);

    // Espera a que Angular pinte <app-hyperspace-overlay> y arráncalo
    // arrancar la secuencia cuando el overlay existe en el DOM
    queueMicrotask(() => this.overlay?.startAutoSequence());
  }

  // nos lo emite el overlay cuando termina
  onHyperspaceDone() {
    this.router.navigate(['/starships']);
    this.hyperspace.set(false);
    document.documentElement.classList.remove('hide-home-ui');
  }
}


