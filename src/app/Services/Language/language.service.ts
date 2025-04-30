import { computed, effect, Injectable, Signal, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../CommonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private langSignal = signal('en');
  dirSignal: Signal<string>;
  rtlClassSignal: Signal<boolean>;

  constructor(private translateService: TranslateService,private __CommonService:CommonService) {
    const lang=this.__CommonService.getItemsFromStorage<string>('lang','en');
    if(lang != 'en') this.langSignal.set(lang);
    this.translateService.setDefaultLang(lang);
    this.translateService.use(lang);
     this.dirSignal = computed(() => {
      const lang = this.langSignal();
      return lang === 'ar' ? 'rtl' : 'ltr';
    });

    this.rtlClassSignal = computed(() => this.langSignal() === 'ar');

     effect(() => {
    const lang = this.langSignal();
    const isRtl = this.rtlClassSignal();
    this.switchStyleToRTL(isRtl, lang);
  });
  }

  getLangSignal(): Signal<string> {
    return this.langSignal;
  }

  changeLanguage(lang: string): void {
    this.langSignal.set(lang);
    this.translateService.use(lang);
    this.__CommonService.saveToStorage('lang',lang)
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
