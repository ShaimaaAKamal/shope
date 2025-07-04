
import { CommonService } from '../../../Services/CommonService/common.service';
import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { PopScreenComponent } from '../pop-screen/pop-screen.component';

@Component({
  selector: 'app-generic-category-variant',
  standalone: false,
  templateUrl: './generic-category-variant.component.html',
  styleUrl: './generic-category-variant.component.scss'
})
export class GenericCategoryVariantComponent <T extends { id?: number, nameEn: string, nameAr: string, isActive: boolean }> {
  private __CommonService=inject(CommonService);
  @ViewChild('Name') NameInput!: InputComponent;
  @ViewChild('NameAr') NameAr!: InputComponent;
  @ViewChild('popScreen') popScreen!: PopScreenComponent;

  @Input() config!: {
    header: string;
    label:string,
    item: T;
    service: {
      create: (item: T) => any;
      update: (item: T) => any;
    };
  };

  @Output() created = new EventEmitter<T>();

  errorMessage: string = '';
  errorArabicrMessage: string = '';
  ActiveDropDownSelection: string = 'Active';
  readonly ActiveOptions = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
  ];

  ngAfterViewInit(): void {
    if (this.config.item?.id) {
      this.fillInputFields(this.config.item);
    }
  }

  fillInputFields(item: T) {
    this.NameInput.value = item.nameEn;
    this.NameAr.value = item.nameAr;
    setTimeout(() => {
      this.ActiveDropDownSelection = item.isActive ? 'Active' : 'Inactive';
    });
  }

  changeSelect(event: any, key: 'isActive' | 'customerType') {
    if (key === 'isActive') {
      this.ActiveDropDownSelection = event.title;
    }
  }

  clearForm() {
    this.created.emit({} as T);
  }

  create(): void {
    const name = this.NameInput.value.trim();
    const nameAr = this.NameAr.value.trim();
    const isActive = this.ActiveDropDownSelection === 'Active';
    const id = this.config.item?.id ?? null;

    const result = this.__CommonService.validatenNameInputs(name, nameAr);

    // Reset errors
    this.errorMessage = '';
    this.errorArabicrMessage = '';

    if (!result.status) {
      for (const err of result.errors) {
        if (err.errorType === 'missing_Name') {
          this.errorMessage = err.message;
        } else if (err.errorType === 'missing_Arabic_Name') {
          this.errorArabicrMessage = err.message;
        }
      }
      return;
    }

    const newItem: T = {
      ...this.config.item,
      nameEn: name,
      nameAr: nameAr,
      isActive: isActive
    };

    const request$ = id
      ? this.config.service.update({ ...newItem, id } as T)
      : this.config.service.create(newItem);

    request$.subscribe({
      next: (data: T) => this.created.emit(id ? { ...newItem, id } : data)
    });
  }
  // create(): void {
  //   const name = this.NameInput.value.trim();
  //   const nameAr = this.NameAr.value.trim();
  //   const isActive = this.ActiveDropDownSelection === 'Active';
  //   const id = this.config.item?.id ?? null;

  //  const result=this.__CommonService.validatenNameInputs(name, nameAr);
  //  if(!result.status){
  //    this.errorMessage = result.errorType== 'missing_Name' ? result.message : '';
  //    this.errorArabicrMessage =result.errorType== 'missing_Arabic_Name' ?result.message:'';
  //    return;
  //  }
  //  else{
  //   this.errorMessage='';
  //   this.errorArabicrMessage='';
  //   const newItem: T = {
  //     ...this.config.item,
  //     nameEn: name,
  //     nameAr: nameAr,
  //     isActive: isActive
  //   };

  //   const request$ = id
  //     ? this.config.service.update({ ...newItem, id } as T)
  //     : this.config.service.create(newItem);
  //   request$.subscribe({
  //     next: (data: T) => this.created.emit(id ? { ...newItem, id } : data)
  //   });
  //  }

  // }
}
