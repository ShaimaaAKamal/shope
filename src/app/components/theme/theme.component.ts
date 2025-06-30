import { Component, effect, inject } from '@angular/core';
import { ThemeService } from '../../Services/Theme/theme.service';

@Component({
  selector: 'app-theme',
  standalone: false,
  templateUrl: './theme.component.html',
  styleUrl: './theme.component.scss'
})
export class ThemeComponent {
private __ThemeService=inject(ThemeService)
selectedTheme = this.__ThemeService.currentTheme;

homeHeaderColors = [
  { name: 'blue', color: '#0d6efd' },
  { name: 'purple', color: '#6610f2' },
  { name: 'green', color: '#A4DD00' },
  { name: 'orange', color: '#fd7e14' },
  { name: 'red', color: '#dc3545'},
   { name:'none' ,color:'#fff'}
];

  constructor() {
    effect(() => {
      this.selectedTheme();
    });
  }

  changeTheme(theme: 'light' | 'dark') {
    this.__ThemeService.setTheme(theme);
  }

  changeHeaderColor(color: {name:string,color:string}) {
    if(color.name != 'none')
    this.__ThemeService.additionalTheme.set(color.name + '-theme');
   else     this.__ThemeService.additionalTheme.set('none');

  }
}
