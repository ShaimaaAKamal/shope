export type FilterFieldType = 'select' | 'input' | 'checkbox' | 'radio';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterField {
  operation?:number;
  type: FilterFieldType;
  controlName: string;
  label: string;
  placeholder?: string;
  inputType?: string;
  options?: FilterOption[];
  filterValue?:any,
  filterName?:string
}

export interface FilterSection {
  title: string;
  collapseId: string;
  fields: FilterField[];
}
