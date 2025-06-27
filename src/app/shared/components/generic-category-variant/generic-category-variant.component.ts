import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { InputComponent } from '../input/input.component';
import { PopScreenComponent } from '../pop-screen/pop-screen.component';

@Component({
  selector: 'app-generic-category-variant',
  standalone: false,
  templateUrl: './generic-category-variant.component.html',
  styleUrl: './generic-category-variant.component.scss'
})
export class GenericCategoryVariantComponent <T extends { id?: number, nameEn: string, nameAr: string, isActive: boolean }> {
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
}
