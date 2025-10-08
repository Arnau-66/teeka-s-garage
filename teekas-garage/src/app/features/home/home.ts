import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../auth/login/login';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, LoginComponent],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})


export class HomeComponent {
  showLogin = signal(false);

  openLogin()  { this.showLogin.set(true); document.body.style.overflow = 'hidden'; }
  closeLogin() { this.showLogin.set(false); document.body.style.overflow = ''; }

  @HostListener('document:keydown.escape')
  onEsc(){
    if (this.showLogin()) this.closeLogin();
  }
}
