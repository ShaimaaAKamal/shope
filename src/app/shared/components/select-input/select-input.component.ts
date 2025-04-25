import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-select-input',
  standalone: false,
  templateUrl: './select-input.component.html',
  styleUrl: './select-input.component.scss'
})
export class SelectInputComponent<T extends Record<string, any>>{
  @Input() selected: T | null = null;
 @Input() label: string = '';
  @Input() id: string = '';
  @Input() options: T[] = [];
  @Input() prop:keyof T='';
    @Input() value:keyof T='';
    @Input() vertCLass:string='';
    @Input() noOption:string='Select Customer';
  @Output() selectedOption: EventEmitter<T> = new EventEmitter<T>();

  onSelectionChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
        const selected = this.options.find((opt: any) => String((opt as any)?.id) === value ||  String((opt as any)?.code) === value);
    if (selected) {
      this.selectedOption.emit(selected);
    }
  }
}
