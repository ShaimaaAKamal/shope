
import { Injectable, signal } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class CommonService {


isCollapse=signal<boolean>(false);
page=signal<string>('');

getItemsFromStorage<T = any>(key: string, defaultValue: T): T {
  const item = localStorage.getItem(key);
  return item ? (JSON.parse(item) as T) : defaultValue;
}

saveToStorage(key: string, data: any) {
      localStorage.setItem(key, JSON.stringify(data));
  }

removeItemFromStorage(key:string){
    localStorage.removeItem(key);
  }

controlPopScreen(ref: { togglePopScreen: (action: string) => void }, action: string = 'open'): void {
    ref?.togglePopScreen?.(action);
  }

addOrReplaceItemById<T extends { id?: number | string }>(array: T[], newItem: T): T[] {
    const index = array.findIndex(item => item.id === newItem.id);
    const updated = [...array];

    if (index !== -1) {
      updated[index] = newItem;
    } else {
            updated.unshift(newItem);
     }
    return updated;
  }


 checkDuplicateInArray<T extends { name?: string; nameAr?: string; nameEn?: string }>(
  array: T[],
  matchFn: (item: T) => boolean,
  newValue: T
): { isDuplicate: boolean; message?: string } {
  const index = array.findIndex(matchFn);
  if (index !== -1) {
    let duplicateField: 'name' | 'nameAr' | 'nameEn' | null = null;

    const isDuplicate = array.some((item, i) => {
      if (i === index) return false;

      if ((item.name && item.name === newValue.name) || (item.nameEn && item.nameEn === newValue.nameEn) ) {
        duplicateField = (item.name && item.name === newValue.name) ?'name':'nameEn' ;
        return true;
      }

      if (item.nameAr && item.nameAr === newValue.nameAr) {
        duplicateField = 'nameAr';
        return true;
      }

      return false;
    });

    if (isDuplicate) {
      const message =
        duplicateField === 'nameAr'
          ? 'Duplicate_Arabic_Name'
          : 'Duplicate_English_Name';
      return { isDuplicate: true, message };
    }
  }

  return { isDuplicate: false };
}

findItemInArray<T extends { name?: string,code?:string,nameEn?: string,id?:number , firstNameEn?:string }>(
  array: T[], matchFn: (item: T) => boolean) :{exists:boolean; ind: number; item:any }{
  const index = array.findIndex(matchFn);
  const exists = index !== -1;
  if(exists)
    return {exists:true,ind:index,item:array[index]}
  else return {exists:false, ind:index ,item:null }

}






}
