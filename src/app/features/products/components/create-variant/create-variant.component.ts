import {Component, EventEmitter,Output, signal} from '@angular/core';
@Component({
  selector: 'app-create-variant',
  standalone: false,
  templateUrl: './create-variant.component.html',
  styleUrl: './create-variant.component.scss'
})
export class CreateVariantComponent {

  @Output() closeAddVariantPopScreen = new EventEmitter<void>();
  action=signal<string>('');

  add() {
    this.action.set('add');
  }

  close() {
    this.closeAddVariantPopScreen.emit();
  }
}
