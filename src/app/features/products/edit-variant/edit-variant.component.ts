import {Component,Input,signal,Output,EventEmitter} from '@angular/core';
import { VariantMasterLookUP } from '../../../Interfaces/variant-master-look-up';

@Component({
  selector: 'app-edit-variant',
  standalone: false,
  templateUrl: './edit-variant.component.html',
  styleUrl: './edit-variant.component.scss'
})
export class EditVariantComponent {
    action=signal<string>('');

  @Input() variant!: VariantMasterLookUP;

  @Output() updated=new EventEmitter<void>();

updatedVariant(){
  this.updated.emit();
}
updateVariant(){
  this.action.set('update');
  }

}
