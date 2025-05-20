import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ToastingMessagesService {

  constructor(
    private _ToastrService: ToastrService,
    private translateService: TranslateService
  ) {}

  showToast(toastMessage: string, type: 'success' | 'error' | 'info' | 'warning') {
    const titleKey = `TOAST.${type.toUpperCase()}`;
    const translatedTitle = this.translateService.instant(titleKey);
    const message=this.translateService.instant(toastMessage);
      this._ToastrService.clear();
    switch (type) {
      case 'success':
        this._ToastrService.success(message, translatedTitle);
        break;
      case 'error':
        this._ToastrService.error(message, translatedTitle);
        break;
      case 'info':
        this._ToastrService.info(message, translatedTitle);
        break;
      case 'warning':
        this._ToastrService.warning(message, translatedTitle);
        break;
    }
  }
}
