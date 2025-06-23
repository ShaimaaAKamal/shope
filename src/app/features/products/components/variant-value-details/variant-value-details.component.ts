import {
  Component,
  EventEmitter,
  Input,
  Output,
  QueryList,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  signal,
  computed,
  effect
} from '@angular/core';
import { Subject } from 'rxjs';
import { InputComponent } from '../../../../shared/components/input/input.component';

interface VariantValueDetailsInterface {
  quantity: number;
  displayedVariants: any[];
  index: number;
}

@Component({
  selector: 'app-variant-value-details',
  templateUrl: './variant-value-details.component.html',
  styleUrl: './variant-value-details.component.scss',
  standalone: false
})
export class VariantValueDetailsComponent implements AfterViewInit, OnDestroy {
  private destroy$ = new Subject<void>();

  chargeTaxDropDownSelection = 'Charge';
  priceAffecringDropDownSelection = 'yes';

  ChargeTax = [
    { title: 'Charge', value: true },
    { title: 'Uncharge', value: false }
  ];

  PriceAffecting = [
    { title: 'yes', value: true },
    { title: 'no', value: false }
  ];

  inputFields = [
    { id: 'price', placeholder: 'Price', spanLabel: 'SAR', col: 'col-lg-4', icon: 'fa-money-bill-1-wave', inputGroup: true, triggerRecalc: true },
    { id: 'costPerItem', placeholder: 'Cost Price', spanLabel: 'SAR', col: 'col-lg-4', icon: 'fa-money-bill-1-wave', inputGroup: true, triggerRecalc: true },
    { id: 'comparePrice', placeholder: 'Compare Price', spanLabel: 'SAR', col: 'col-lg-4', icon: 'fa-money-bill-1-wave', inputGroup: true },
    { id: 'profit', placeholder: 'Profit', spanLabel: 'SAR', col: 'col-lg-4', icon: 'fa-money-bill-1-wave', inputGroup: true },
    { id: 'margin', placeholder: 'Margin', spanLabel: '%', col: 'col-lg-4', icon: 'fa-money-bill-1-wave', inputGroup: true },
    { id: 'vatValue', placeholder: 'Vat Value', spanLabel: 'SAR', col: 'col-lg-4', icon: 'fa-money-bill-1-wave', inputGroup: true },
    { id: 'barcode', placeholder: 'Barcode', label: 'Barcode', col: 'col-lg-6', icon: 'fa-barcode', inputGroup: false },
    { id: 'sku', placeholder: 'SkU', col: 'col-lg-6', icon: 'fa-barcode', inputGroup: false }
  ];

  private _inputData = signal<VariantValueDetailsInterface>({
    quantity: 0,
    displayedVariants: [],
    index: -1
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

  private isViewInit = false;

  variantDetail = computed(() => {
    const data = this._inputData();
    return data.displayedVariants[data.index];
  });

  readonly _effect = effect(() => {
    if (!this.isViewInit) return;
    this.tryDisplayVariantDetails();
  });

  ngAfterViewInit() {
    this.isViewInit = true;
    this.tryDisplayVariantDetails();
  }

  private tryDisplayVariantDetails() {
    if (!this.variantDetail() || !this.inputComponentRefs?.length) return;
    this.displayVariantDetails();
  }


  private displayVariantDetails() {
    const detail = this.variantDetail();
    if (!detail) return;

    this.inputComponentRefs.forEach(inputComponent => {
      const key = inputComponent.InputComponentData.id;
      const rawValue = detail[key];
      inputComponent.value = rawValue === 0 ? '' : rawValue ?? '';
    });

    this.chargeTaxDropDownSelection = detail['chargeTax'] ? 'Charge' : 'Uncharge';
    this.priceAffecringDropDownSelection = detail['isPriceAffecting'] ? 'yes' : 'no';

    this._inputData.set({
      ...this._inputData(),
      quantity: detail['quantity'] ?? 0
    });
  }
  changeSelect(selection: any, key: string) {
    if (key === 'chargeTax') {
      this.chargeTaxDropDownSelection = selection.title;
    } else if (key === 'isPriceAffecting') {
      this.priceAffecringDropDownSelection = selection.title;
    }
  }

  updateQuantity(newQuantity: number) {
    this._inputData.set({
      ...this._inputData(),
      quantity: newQuantity
    });

    this.variantProductDetaills.emit(newQuantity);
  }

  getVariantDetails() {
    const variantDetailsValue: Record<string, any> = {};

    this.inputComponentRefs.forEach(inputComponent => {
      const id = inputComponent.InputComponentData.id;
      variantDetailsValue[id] = inputComponent.value?.trim?.() ?? null;
    });

    variantDetailsValue['quantity'] = this._inputData().quantity;
    variantDetailsValue['chargeTax'] = this.chargeTaxDropDownSelection === 'Charge';
    variantDetailsValue['isPriceAffecting'] = this.priceAffecringDropDownSelection === 'yes';

    return variantDetailsValue;
  }

  recalculate() {
    const getInputById = (id: string): InputComponent | undefined =>
      this.inputComponentRefs.find(c => c.InputComponentData.id === id);

    const price = Number(getInputById('price')?.value);
    const cost = Number(getInputById('costPerItem')?.value);
    const profitComp = getInputById('profit');
    const marginComp = getInputById('margin');

    const isValidPrice = !isNaN(price) && price > 0;
    const isValidCost = !isNaN(cost);

    if (!isValidPrice || !isValidCost) {
      if (profitComp) profitComp.value = '';
      if (marginComp) marginComp.value = '';
      return;
    }

    if (cost <= price) {
      const profit = price - cost;
      const margin = (profit / price) * 100;

      if (profitComp) profitComp.value = profit.toFixed(2);
      if (marginComp) marginComp.value = margin.toFixed(1);
    } else {
      if (profitComp) profitComp.value = '0.00';
      if (marginComp) marginComp.value = '0.0';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
