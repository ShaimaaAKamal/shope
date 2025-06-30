// import { effect, Injectable, signal } from '@angular/core';

// @Injectable({
//   providedIn: 'root'
// })
// export class ThemeService {


//    currentTheme=signal<string>('light');
//    additionalTheme=signal<string>('');
//    fullTheme:string[]=[];  // constructor() {

//   constructor() {
//     const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
//      this.fullTheme=JSON.parse(localStorage.getItem('fullTheme') || '[]');
//     const savedTheme = localStorage.getItem('theme');
//     if (this.fullTheme?.length) {
//       this.setFullTheme(this.fullTheme);
//       if(savedTheme) this.currentTheme.set(savedTheme)
//     } else {
//       if (savedTheme === 'light' || savedTheme === 'dark') {
//         this.setTheme(savedTheme);
//       } else {
//         this.setTheme(prefersLight ? 'light' : 'dark');
//       }
//     }

//     window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
//       if (!localStorage.getItem('theme')) {
//         this.setTheme(e.matches ? 'light' : 'dark');
//       }
//     });

//     effect(() => {
//       if (this.additionalTheme()) {
//         this.changeTheme();
//       }
//     });
//   }

//   setTheme(theme: 'light' | 'dark') {
//     this.currentTheme.set(theme);

//     document.body.classList.remove('light-theme', 'dark-theme');
//     document.body.classList.add(`${theme}-theme`);
//     localStorage.setItem('theme', theme);

//     const oppositeTheme = theme === 'light' ? 'dark' : 'light';

//     let fullTheme: string[] = [];

//     fullTheme = this.fullTheme.filter(t => t !== oppositeTheme+'-theme');

//     if (!fullTheme.includes(theme+'-theme')) {
//       fullTheme.push(theme+'-theme');
//     }

//     localStorage.setItem('fullTheme', JSON.stringify(fullTheme));
//   }

//   setFullTheme(theme: string[]) {
//     document.body.className = '';
//     const cleaned = theme.map(cls => cls.trim()).filter(Boolean);
//     document.body.classList.add(...cleaned);
//   }

//   changeTheme() {
//     document.body.className = '';
//     const baseTheme = `${this.currentTheme()}-theme`;
//     if(this.additionalTheme() != 'none'){
//       const additional = this.additionalTheme();
//       const classListToAdd = [additional,baseTheme].filter(Boolean);
//       localStorage.setItem('fullTheme',JSON.stringify(classListToAdd));
//       document.body.classList.add(...classListToAdd);
//     }else{
//       localStorage.setItem('fullTheme',JSON.stringify([baseTheme]));
//       document.body.classList.add(baseTheme);
//     }

//   }

//   toggleTheme() {
//     this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
//   }


// }

import { effect, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  currentTheme = signal<'light' | 'dark'>('light');
  additionalTheme = signal<string>(''); // e.g. 'blue-theme'
  fullTheme: string[] = [];

  constructor() {
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    this.fullTheme = this.getStoredThemeList();
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;

    if (this.fullTheme.length) {
      this.setFullTheme(this.fullTheme);
      if (savedTheme) this.currentTheme.set(savedTheme);
    } else {
      const defaultTheme = savedTheme === 'light' || savedTheme === 'dark'
        ? savedTheme
        : prefersLight ? 'light' : 'dark';
      this.setTheme(defaultTheme);
    }

    // Watch for system preference changes
    window.matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!localStorage.getItem('theme')) {
        this.setTheme(e.matches ? 'light' : 'dark');
      }
    });

    // React to additionalTheme changes
    effect(() => {
      if (this.additionalTheme()) {
        this.updateBodyClass();
      }
    });
  }

  private getStoredThemeList(): string[] {
    try {
      return JSON.parse(localStorage.getItem('fullTheme') || '[]');
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

    localStorage.setItem('theme', theme);
    localStorage.setItem('fullTheme', JSON.stringify(updatedThemes));

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
    localStorage.setItem('fullTheme', JSON.stringify(themeList));

    this.setFullTheme(themeList);
  }

  toggleTheme() {
    this.setTheme(this.currentTheme() === 'light' ? 'dark' : 'light');
  }
}
