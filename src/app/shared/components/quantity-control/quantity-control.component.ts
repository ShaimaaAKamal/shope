import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quantity-control',
  standalone: false,
  templateUrl: './quantity-control.component.html',
  styleUrl: './quantity-control.component.scss'
})
export class QuantityControlComponent {
@Input() quantity:number=1;

@Output() quantityChange = new EventEmitter<number>();

updateQuantity(change: number): void {

    const newValue = Number(this.quantity) + change;
    if (newValue >= 1) {
      this.quantity = newValue;
      this.quantityChange.emit(this.quantity);
    }
  }
}
