import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterSection } from '../../../Interfaces/filter-options';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';


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
    this.filtersApplied.emit(this.filterForm.value);
  }

  resetFilters() {
    this.filterForm.reset();
    this.filtersReset.emit();
  }
}
