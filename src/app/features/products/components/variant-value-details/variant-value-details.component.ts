
import {
  Component,EventEmitter, Input, Output,QueryList,ViewChildren,AfterViewInit,OnDestroy,signal,computed,effect} from '@angular/core';
import { Subject } from 'rxjs';
import { InputComponent } from '../../../../shared/components/input/input.component';

// interface VariantValueDetailsInterface{
// quantity:string,
// displayedVariants:any[],
// index:number
// }
interface VariantValueDetailsInterface{
quantity:number,
displayedVariants:any[],
index:number
}
@Component({
  selector: 'app-variant-value-details',
  templateUrl: './variant-value-details.component.html',
  styleUrl: './variant-value-details.component.scss',
  standalone:false
})
export class VariantValueDetailsComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // private _inputData = signal<VariantValueDetailsInterface>({
  //   quantity: '0',
  //   displayedVariants: [],
  //   index: -1,
  // });

    private _inputData = signal<VariantValueDetailsInterface>({
    quantity: 0,
    displayedVariants: [],
    index: -1,
  });

  @Input()
  set VariantValueDetailsComponentData(value: VariantValueDetailsInterface) {
    this._inputData.set(value);
  }

  get VariantValueDetailsComponentData(): VariantValueDetailsInterface {
    return this._inputData();
  }

  @ViewChildren('inputRef') inputComponentRefs!: QueryList<InputComponent>;
  @Output() variantProductDetaills = new EventEmitter<any>();

  variantDetail = computed(() =>
    this._inputData().displayedVariants[this._inputData().index]
  );
private isViewInit = false;

ngAfterViewInit() {
  this.isViewInit = true;
  this.tryDisplayVariantDetails();
}

readonly _effect = effect(() => {
  if (!this.isViewInit) return;
  this.tryDisplayVariantDetails();
});

  private tryDisplayVariantDetails() {
    if (!this.variantDetail() || !this.inputComponentRefs?.length) return;
    this.displayVariantDetails();
  }

  displayVariantDetails() {
    const detail = this.variantDetail();
    if (!detail) return;

    this.inputComponentRefs.forEach(inputComponent => {
      inputComponent.value =
        detail.details?.[inputComponent.InputComponentData.id] ?? '';
    });

    const updated = this._inputData();
    this._inputData.set({
      ...updated,
      quantity: detail.details?.['quantity'] ?? '0',
    });
  }

  // updateQuantity(newQuantity: string) {
  //   const updated = this._inputData();
  //   this._inputData.set({
  //     ...updated,
  //     quantity: newQuantity,
  //   });
  //   this.variantProductDetaills.emit(newQuantity);
  // }
    updateQuantity(newQuantity: number) {
    const updated = this._inputData();
    this._inputData.set({
      ...updated,
      quantity: newQuantity,
    });
    this.variantProductDetaills.emit(newQuantity);
  }

  getVariantDetails() {
    const variantDetailsValue: Record<string, any> = {};

    this.inputComponentRefs.forEach(inputComponent => {
      const id = inputComponent.InputComponentData.id;
      const value = inputComponent.value?.trim?.() ?? null;
      if (id) {
        variantDetailsValue[id] = value;
      }
    });

    variantDetailsValue['quantity'] = this._inputData().quantity;
    return variantDetailsValue;
  }

   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
