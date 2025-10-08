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

  openLogin() {this.showLogin.set(true);}
  closeLogin() {this.showLogin.set(false);}

  @HostListener('document:keydown.escape')
  onEsc(){
    if (this.showLogin()) this.closeLogin();
  }
}
