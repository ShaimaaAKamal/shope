import {
Component,EventEmitter,inject,Output,signal,effect} from '@angular/core';
import { ProductService } from '../../../../Services/Product/product.service';
import { Variant } from '../../../../Interfaces/variant';

@Component({
  selector: 'app-variants',
  standalone: false,
  templateUrl: './variants.component.html',
  styleUrl: './variants.component.scss',
})
export class VariantsComponent {
  private __ProductService = inject(ProductService);
  product = this.__ProductService.currentProduct;

  displayVariant = signal(false);
  variantsDetails!: any[];

  @Output() controlVariantsPopup = new EventEmitter<string>();
  @Output() variantDetailsHandled = new EventEmitter<void>();

  localVariants = signal<Variant[]>([]);
  private firstChange=true;
  constructor() {
    effect(() => {
      const inputVal = this.localVariants();
      if(!this.firstChange){
          this.localVariants.set(inputVal ?? []);
      if (!inputVal || inputVal.length === 0) {
        this.displayVariant.set(false);
      }
      }
      this.firstChange=false;
    });
  }

  ngOnInit(): void {
    this.localVariants.set(this.product().variants ?? []);
    this.variantsDetails = this.product().variantsDetails ?? [];
  }

  showOptionsSection() {
    this.displayVariant.set(true);
  }

  setProductVariants(event: Variant[]) {
    this.localVariants.set(event);
    const product = this.product();
    product.variants = event;
    this.displayVariant.set(false);
  }

  deleteVariant(index: number) {
    const updated = this.localVariants().filter((_, i) => i !== index);
    this.localVariants.set(updated);

    const product = this.product();
    product.variants = updated;

    if (updated.length === 0) {
      product.variantsDetails = [];
    }

    this.product.set(product);
  }

  controlVariantsPopupScreen(action: string) {
    this.controlVariantsPopup.emit(action);
  }

  variantDetailsHandledFn() {
    this.variantDetailsHandled.emit();
  }
}
