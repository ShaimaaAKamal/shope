import { computed, Injectable, Signal, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

    private langSignal = signal('en');

   
  constructor(private translateService: TranslateService) {
    this.translateService.setDefaultLang('en');
    this.translateService.use('en');
  }

  getLangSignal(): Signal<string> {
    return this.langSignal;
  }

  changeLanguage(lang: string): void {
    this.langSignal.set(lang);
    this.translateService.use(lang);
  }
}
