import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavitemComponent } from '../navitem/navitem.component';
import { Navitem } from '../../../Interfaces/navitem';
import { CommonService } from '../../../Services/CommonService/common.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
  @ViewChild('sideNav') sideNav!: ElementRef;
  @ViewChild('logo') logo!: NavitemComponent;

  isCollapsed!: boolean;
  smallScreen = false;
  personImage = 'person.jpg';
  salesPersonName = 'Ahmed Kamal';
  lang: string = 'Arabic';

  sectionOneNavItems: Navitem[] = [
    { name: 'Orders',
      icon: 'fa-solid fa-credit-card',
      subItems: [
        { name: 'New Order', icon: 'fa-solid fa-square-plus' },
      ]
     },
    {
      name: 'Products',
      icon: 'fa-solid fa-tags',
      subItems: [
        { name: 'Variants_Library', icon: 'fa-solid fa-photo-film' },
        { name: 'Categories', icon: 'fa-solid fa-layer-group' }
      ]
    },
    { name: 'Customers', icon: 'fa-solid fa-users' },
    { name: 'Discounts', icon: 'fa-solid fa-percent' },
    { name: 'Reports', icon: 'fa-solid fa-chart-simple' }
  ];

  sectionTwoNavItems: Navitem[] = [
    {
      name: 'Settings',
      icon: 'fa-solid fa-gear',
      // subItems: [
      //   { name: 'General_Settings', icon: 'fa-solid fa-sliders' },
      //   { name: 'User_Management', icon: 'fa-solid fa-users-gear' }
      // ]
    },
    { name: this.lang, icon: 'fa-solid fa-globe' },
    { name: 'Return_Order', icon: 'fa-solid fa-right-left' },
    { name: 'End_Day', icon: 'fa-solid fa-rectangle-xmark' },
    { name: 'Hold_Orders', icon: 'fa-solid fa-hourglass-start' }
  ];

  constructor(private commonService: CommonService, private __TranslateService: TranslateService) {
    this.isCollapsed = this.commonService.isCollapse();

    this.__TranslateService.onLangChange.subscribe(event => {
      const lang = event.lang;
      this.lang = lang === 'ar' ? 'اللغة الإنجليزية' : 'Arabic';
      this.updateLanguageItem();
    });
  }

  private updateLanguageItem() {
    const langIndex = this.sectionTwoNavItems.findIndex(item =>
      item.name === 'Arabic' || item.name === 'اللغة الإنجليزية'
    );
    if (langIndex !== -1) {
      this.sectionTwoNavItems[langIndex].name = this.lang;
    }
  }

  ngOnInit() {
    this.setIsCollapsed();
    this.smallScreen = window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {
    this.smallScreen = window.innerWidth < 768;
    this.smallScreen ? this.logo?.hideHeader() : this.logo?.showHeader();
    this.setIsCollapsed();
  }

  private setIsCollapsed() {
    if (window.innerWidth < 768) {
      this.commonService.isCollapse.set(true);
    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.commonService.isCollapse.set(this.isCollapsed);
    this.setIsCollapsed();
  }
}
