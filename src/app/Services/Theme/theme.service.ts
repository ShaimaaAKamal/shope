import { effect, Injectable, signal } from '@angular/core';
import { CommonService } from '../CommonService/common.service';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<'light' | 'dark'>('light');
  additionalTheme = signal<string>('');
  fullTheme: string[] = [];

  constructor(private __CommonService:CommonService) {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    this.fullTheme = this.getStoredThemeList();
    const savedTheme = this.__CommonService.getItemsFromStorage('theme',null) as 'light' | 'dark' | null;


    if (this.fullTheme.length) {
      this.setFullTheme(this.fullTheme);
      if (savedTheme) this.currentTheme.set(savedTheme);
    } else {
      const defaultTheme = savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : prefersLight ? 'light' : 'dark';
      this.setTheme(defaultTheme);
    }

    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
        if (!this.__CommonService.getItemsFromStorage('theme',null)) {
        this.setTheme(e.matches ? 'light' : 'dark');
      }
    });

    effect(() => {
      if (this.additionalTheme()) {
        this.updateBodyClass();
      }
    });
  }

  private getStoredThemeList(): string[] {
    try {
      return (this.__CommonService.getItemsFromStorage('fullTheme',[]));
    } catch {
      return [];
    }
  }

  setTheme(theme: 'light' | 'dark') {
    this.currentTheme.set(theme);
    const oppositeTheme = theme === 'light' ? 'dark' : 'light';
    const updatedThemes = this.fullTheme
      .filter(cls => cls !== `${oppositeTheme}-theme`)
      .filter(cls => cls !== `${theme}-theme`);

    updatedThemes.push(`${theme}-theme`);
    this.fullTheme = updatedThemes;
    this.__CommonService.saveToStorage('theme',theme);
    this.__CommonService.saveToStorage('fullTheme',updatedThemes);
    this.setFullTheme(updatedThemes);
  }

  setFullTheme(theme: string[]) {
    const cleanedClasses = theme.map(cls => cls.trim()).filter(Boolean);
    document.body.className = '';
    document.body.classList.add(...cleanedClasses);
  }

  private updateBodyClass() {
    const base = `${this.currentTheme()}-theme`;
    const additional = this.additionalTheme();

    const themeList = additional && additional !== 'none'
      ? [additional, base]
      : [base];

    this.fullTheme = themeList;
    this.__CommonService.saveToStorage('fullTheme',themeList);
    this.setFullTheme(themeList);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }
}
