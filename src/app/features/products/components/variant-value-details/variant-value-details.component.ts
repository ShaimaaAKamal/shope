
import {
  Component,EventEmitter, Input, Output,QueryList,ViewChildren,AfterViewInit,OnDestroy,signal,computed,effect} from '@angular/core';
import { Subject } from 'rxjs';
import { InputComponent } from '../../../../shared/components/input/input.component';
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

chargeTaxDropDownSelection:string='Charge';
priceAffecringDropDownSelection:string='yes';
ChargeTax:any[]=[
{title:'Charge', value:true},
 {title: "Uncharge",value:false}
]
PriceAffecting:any[]=[
{title:'yes', value:true},
 {title: "no",value:false}
]
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

changeSelect(method:any,key:string){
    if(key == 'chargeTax') this.chargeTaxDropDownSelection=method.title;
    if(key == 'isPriceAffecting') this.priceAffecringDropDownSelection=method.title;
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
    variantDetailsValue['chargeTax'] = this.chargeTaxDropDownSelection == 'Charge' ;
    variantDetailsValue['isPriceAffecting'] = this.priceAffecringDropDownSelection == 'yes' ;
    console.log('getDtails',variantDetailsValue)
    return variantDetailsValue;
  }

  recalculate() {
  const inputs = this.inputComponentRefs.toArray();
  const priceComp = inputs[0];
  const costComp = inputs[1];
  const profitComp = inputs[3];
  const marginComp = inputs[4];

  const price = Number(priceComp?.value);
  const costPrice = Number(costComp?.value);

  const isValidPrice = !isNaN(price) && price > 0;
  const isValidCost = !isNaN(costPrice);

  if (isValidPrice && isValidCost && profitComp && marginComp) {
    if (costPrice <= price) {
      const profit = price - costPrice;
      const margin = (profit / price) * 100;

      profitComp.value = profit.toFixed(2);
      marginComp.value = margin.toFixed(1);
    } else {
      profitComp.value = '0.00';
      marginComp.value = '0.0';
    }
  } else {
    if (profitComp) profitComp.value = '';
    if (marginComp) marginComp.value = '';
  }
}
   ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
