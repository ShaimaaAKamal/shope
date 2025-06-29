import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {


  private currentTheme = 'light';

  constructor() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: light)').matches;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      this.setTheme(savedTheme);
    } else if (prefersDark) {
      this.setTheme('light');
    }


    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme = theme;
    document.body.classList.remove('light-theme', 'dark-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    console.log('in toggle tmenm');
    console.log('current theme',this.currentTheme);
  }

  getCurrentTheme() {
    return this.currentTheme;
  }
}
