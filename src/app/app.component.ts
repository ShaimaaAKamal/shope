import { Component, effect, ElementRef, HostListener, ViewChild } from '@angular/core';
  import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from './Services/Language/language.service';
import { SidenavComponent } from './components/sideNavComponents/sidenav/sidenav.component';

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


  constructor(private translateService: TranslateService,private __LanguageService:LanguageService) {
    this.translateService.setDefaultLang('en');

    this.__LanguageService.dirSignal();
    this.__LanguageService.rtlClassSignal();

    effect(() => {
      const dir = this.__LanguageService.dirSignal();
      document.documentElement.setAttribute('dir', dir);
    });

    effect(() => {
      const isRtl = this.__LanguageService.rtlClassSignal();
      this.__LanguageService.switchStyleToRTL(isRtl,this.__LanguageService.getLangSignal()());
    });
}

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
