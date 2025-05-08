import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommonService {


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

  getItemsFromStorage<T = any>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : defaultValue;
}

  saveToStorage(key: string, data: any) {
      localStorage.setItem(key, JSON.stringify(data));
  }


updateItemInArray<T extends { name?: string }>(
  array: T[],
  matchFn: (item: T) => boolean,
  newValue: T,
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

findItemInArray<T extends { name?: string,code?:string }>(
  array: T[], matchFn: (item: T) => boolean) :{exists:boolean; ind: number; item:any }{
  const index = array.findIndex(matchFn);
  const exists = index !== -1;
  if(exists)
    return {exists:true,ind:index,item:array[index]}
  else return {exists:false, ind:index ,item:null }

}
controlPopScreen(ref: { togglePopScreen: (action: string) => void }, action: string = 'open'): void {
  ref?.togglePopScreen?.(action);
}

}
