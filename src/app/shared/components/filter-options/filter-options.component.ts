import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterSection } from '../../../Interfaces/filter-options';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

// type FilterOperation = 0 | 1 | 2 | 3 | 4 |5 | 6 | 7 | 8 | 9;

interface FilterOption {
  // operation: FilterOperation;
  operation: number;
  propertyName: string;
  propertyValue: string;
}

@Component({
  selector: 'app-filter-options',
  standalone: false,
  templateUrl: './filter-options.component.html',
  styleUrl: './filter-options.component.scss'
})
export class FilterOptionsComponent {
  @Input() sections: FilterSection[] = [];
  @Output() filtersApplied = new EventEmitter<any>();
  @Output() filtersReset = new EventEmitter<void>();

  filterForm!: FormGroup
  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({});

  }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.sections.forEach(section => {
      section.fields.forEach(field => {
        this.filterForm.addControl(field.controlName, new FormControl(null));
      });
    });
  }

  applyFilters() {
    const mappedFilters= this.mapToApiFilterStructure(this.sections, this.filterForm.value);
    this.filtersApplied.emit(mappedFilters);

  }

  // mapToApiFilterStructure( sections: FilterSection[],
  //   values: { [key: string]: any }):FilterOption[]{
  //   const filters: FilterOption[] = [];

  //   for (const section of sections) {
  //     for (const field of section.fields) {
  //       const value = values[field.controlName];
  //       if (
  //         value !== null &&
  //         value !== undefined &&
  //         value !== '' &&
  //         !(Array.isArray(value) && value.length === 0)
  //       ) {
  //         filters.push({
  //           operation: field.operation ?? 0,
  //           propertyName: field.filterName?? field.controlName,
  //           propertyValue: field.filterValue ?? value
  //         });
  //       }
  //     }
  //   }

  //   return filters;
  //   }


  mapToApiFilterStructure( sections: FilterSection[],
    values: { [key: string]: any }):FilterOption[]{
    const filters: FilterOption[] = [];

    for (const section of sections) {
      for (const field of section.fields) {
        const value = values[field.controlName];
        if (
          value !== null &&
          value !== undefined &&
          value !== '' && value &&
          !(Array.isArray(value) && value.length === 0) && (field.controlName != 'all' && value)
        ) {
          const propertyName = field.filterName ?? field.controlName;
          const propertyValue =
          field.filterValue ?? ((propertyName=== 'category' || propertyName === 'quantity') ? Number(value) : value);
          filters.push({
            operation: field.operation ?? 0,
            propertyName:propertyName,
            propertyValue: propertyValue
          });
        }
      }
    }

    return filters;
    }


  resetFilters() {
    this.filterForm.reset();
    this.filtersReset.emit();
  }
}
