import { Component } from '@angular/core';

@Component({
  selector: 'app-theme',
  standalone: false,
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent {
selectedTheme = localStorage.getItem('theme') || 'light-theme';

  homeHeaderColors = ['#0d6efd', '#6610f2', '#198754', '#fd7e14', '#dc3545']; // example colors

  constructor() {
    this.applyTheme(this.selectedTheme);
  }

  changeTheme(theme: string) {
    this.selectedTheme = theme;
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  applyTheme(theme: string) {
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(theme);
  }

  changeHeaderColor(color: string) {
    document.documentElement.style.setProperty('--header-bg-color', color);
  }
}
