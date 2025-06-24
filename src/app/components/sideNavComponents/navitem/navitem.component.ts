import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageService } from '../../../Services/Language/language.service';
import { Navitem } from '../../../Interfaces/navitem';

interface NavitemInterface {
  isCollapsed: boolean;
  navItemName: string;
  classes: string;
  subItems?: Navitem[];
}

@Component({
  selector: 'app-navitem',
  standalone: false,
  templateUrl: './navitem.component.html',
  styleUrl: './navitem.component.scss'
})
export class NavitemComponent {
  @Input() NavitemComponentData: NavitemInterface = {
    isCollapsed: false,
    navItemName: '',
    classes: ''
  };

  @ViewChild('shopping') shopping!: ElementRef;

  showSubnav = false;

  constructor(private __Router: Router, private __LanguageService: LanguageService) {}

  showHeader() {
    this.shopping?.nativeElement?.classList.remove('d-none');
  }

  hideHeader() {
    this.shopping?.nativeElement?.classList.add('d-none');
  }

  toggleSubnav() {
    if (this.NavitemComponentData.subItems?.length) {
      this.showSubnav = !this.showSubnav;
    }
  }

  handleSpecialClick(name: string) {
    switch (name) {
      case 'Hold_Orders':
        this.__Router.navigateByUrl('Orders/create?popup=hold_orders');
        break;
      case 'Return_Order':
        this.__Router.navigateByUrl('Orders/create?popup=return_orders');
        break;
      case 'End_Day':
        console.log('End Day clicked!');
        break;
      case 'Arabic':
        this.__LanguageService.changeLanguage('ar');
        break;
      case 'اللغة الإنجليزية':
        this.__LanguageService.changeLanguage('en');
        break;
    }
  }
}
