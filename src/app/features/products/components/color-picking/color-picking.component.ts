import { Component, EventEmitter, Input, Output, signal, WritableSignal } from '@angular/core';

interface ColorPickingInterface{
  value:string,
  index:number,
  values: WritableSignal<string[]>
}
@Component({
  selector: 'app-color-picking',
  standalone: false,
  templateUrl: './color-picking.component.html',
  styleUrl: './color-picking.component.scss'
})
export class ColorPickingComponent {
@Input() ColorPickingData:ColorPickingInterface={
  value:'',
  index:-1,
  values:signal<string[]>([])
}

@Output() color = new EventEmitter<string>();
showColorPicker: boolean[] = [];


 toggleColorPicker(index: number): void {
    this.showColorPicker[index] = true;
  }

  hideColorPicker(index: number): void {
    this.showColorPicker[index] = false;
  }

  onColorChange(color: string, index: number): void {
    const updated = [...this.ColorPickingData.values()];
    updated[index] = color;
    this.ColorPickingData.values.set(updated);
    this.ColorPickingData.value= color;
     this.color.emit(color);
    this.hideColorPicker(index);
  }
}
