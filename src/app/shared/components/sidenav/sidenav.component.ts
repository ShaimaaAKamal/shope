import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { NavitemComponent } from '../navitem/navitem.component';
import { Navitem } from '../../../Interfaces/navitem';
import { CommonService } from '../../../Services/CommonService/common.service';

@Component({
  selector: 'app-sidenav',
  standalone: false,
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.scss'
})
export class SidenavComponent {
@ViewChild('sideNav') sideNav!: ElementRef;
@ViewChild('logo') logo!: NavitemComponent;

  // isCollapsed = false;
  isCollapsed!:boolean;
  smallScreen = false;
  personImage = 'person.jpg';
  salesPersonName = 'Ahmed Kamal';

  sectionOneNavItems: Navitem[] = [
    { name: 'Home', icon: 'fa-solid fa-house' },
    { name: 'Products', icon: 'fa-solid fa-tags' },
    { name: 'Orders', icon: 'fa-solid fa-credit-card' },
    { name: 'Customers', icon: 'fa-solid fa-users' },
    { name: 'Discounts', icon: 'fa-solid fa-percent' },
    { name: 'Reports', icon: 'fa-solid fa-chart-simple' },
  ];

  sectionTwoNavItems: Navitem[] = [
    { name: 'Settings', icon: 'fa-solid fa-gear' },
    { name: 'Arabic', icon: 'fa-solid fa-globe' },
    { name: 'Return_Order', icon: 'fa-solid fa-right-left' },
    { name: 'End_Day', icon: 'fa-solid fa-rectangle-xmark' },
    { name: 'Hold_Orders', icon: 'fa-solid fa-hourglass-start' },
  ];

  constructor(private commonService: CommonService) {
    // this.commonService.isCollapse.subscribe({
    //   next: isCollapse => (this.isCollapsed = isCollapse),
    // });
    this.isCollapsed=this.commonService.isCollapse();
  }

  ngOnInit() {
    this.setIsCollapsed();
    this.smallScreen = window.innerWidth < 768;
  }

  @HostListener('window:resize')
  onResize() {
    const isSmall = window.innerWidth < 768;
    this.smallScreen = isSmall;
    isSmall ? this.logo.hideHeader() : this.logo.showHeader();
    this.setIsCollapsed();
  }

  private setIsCollapsed() {
    if (window.innerWidth < 768) {
      // this.commonService.isCollapse.next(true);
            this.commonService.isCollapse.set(true);

    }
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    // this.commonService.isCollapse.next(this.isCollapsed);
    this.commonService.isCollapse.set(this.isCollapsed);
    this.setIsCollapsed();
  }
}
