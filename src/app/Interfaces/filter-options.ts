export type FilterFieldType = 'select' | 'input' | 'checkbox' | 'radio';

export interface FilterOption {
  label: string;
  value: any;
}

export interface FilterField {
  type: FilterFieldType;
  controlName: string;
  label: string;
  placeholder?: string;
  inputType?: string;
  options?: FilterOption[]; 
}

export interface FilterSection {
  title: string;
  collapseId: string;
  fields: FilterField[];
}
