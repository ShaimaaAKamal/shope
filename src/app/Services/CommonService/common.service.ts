import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  // isCollapse=new BehaviorSubject<boolean>(false);

  isCollapse=signal<boolean>(false);


 constructor() {}

   generate10CharCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code = '';
  for (let i = 0; i < 10; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}
  getItemsFromStorage(key: string): any[] {
     const items = localStorage.getItem(key);
      return items ? JSON.parse(items) : [];
  }

  saveToStorage(key: string, data: any) {
      localStorage.setItem(key, JSON.stringify(data));
  }


updateItemInArray<T extends { name?: string }>(
  array: T[],
  matchFn: (item: T) => boolean,
  newValue: T,
  type: string = ''
): { updated: boolean; array: T[] } {
  const index = array.findIndex(matchFn);
  const updated = index !== -1;

  if (updated) {
    const isDuplicate = array.some((item, i) => i !== index && item.name === newValue.name);

    if (!isDuplicate) {
      array[index] = newValue;
    } else {
      console.warn('Duplicate name found. Update aborted.');
      return { updated: false, array };
    }
  }
  return { updated, array };
}

controlPopScreen(ref: { togglePopScreen: (action: string) => void }, action: string = 'open'): void {
  ref?.togglePopScreen?.(action);
}
}
