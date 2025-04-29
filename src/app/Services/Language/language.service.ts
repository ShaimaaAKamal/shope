import { computed, Injectable, Signal, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private langSignal = signal('en');
  dirSignal: Signal<string>;
  rtlClassSignal: Signal<boolean>;

  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
     this.dirSignal = computed(() => {
      const lang = this.langSignal();
      return lang === 'ar' ? 'rtl' : 'ltr';
    });

    this.rtlClassSignal = computed(() => this.langSignal() === 'ar');
  }

  getLangSignal(): Signal<string> {
    return this.langSignal;
  }

  changeLanguage(lang: string): void {
    this.langSignal.set(lang);
    this.translateService.use(lang);
    this.switchStyleToRTL(this.rtlClassSignal(),lang);
  }
    switchStyleToRTL(isRTL: boolean,lang:string) {
    const head = document.getElementsByTagName('head')[0];
    let existingLink = document.getElementById('bootstrap-style') as HTMLLinkElement;
    if (existingLink) {
      head.removeChild(existingLink);
    }

    const newLink = document.createElement('link');
    newLink.id = 'bootstrap-style';
    newLink.rel = 'stylesheet';
    newLink.href = isRTL
      ? 'bootstrap-rtl.css'
      : 'bootstrap-ltr.css';

    head.appendChild(newLink);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang',lang);
  }
}
