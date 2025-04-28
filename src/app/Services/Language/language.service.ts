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
  }
}
