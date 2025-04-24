import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { SidenavComponent } from './shared/components/sidenav/sidenav.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'shope';
  @ViewChild('sideNavContainer') sideNavContainer!:ElementRef;
  @ViewChild('sideNav') sideNav!:SidenavComponent;

  @HostListener('window:resize')
  onResize() {
    if(window.innerWidth < 768)
      this.sideNavContainer.nativeElement.classList.add('d-none');
  }

   showSideNav(){
    this.sideNavContainer.nativeElement.classList.toggle('d-none');
    this.sideNav.logo.hideHeader();
   }
}
