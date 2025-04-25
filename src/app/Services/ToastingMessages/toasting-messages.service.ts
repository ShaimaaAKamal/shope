import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastingMessagesService {

  constructor(private _ToastrService:ToastrService) { }

  showToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
    switch (type) {
      case 'success':
        this._ToastrService.success(message, 'Success');
        break;
      case 'error':
        this._ToastrService.error(message, 'Error');
        break;
      case 'info':
        this._ToastrService.info(message, 'Info');
        break;
      case 'warning':
        this._ToastrService.warning(message, 'Warning');
        break;
    }
  }

}
