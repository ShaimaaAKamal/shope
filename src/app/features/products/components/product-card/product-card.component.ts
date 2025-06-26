import { Category } from './../../../../Interfaces/category';
import {  Component, effect, ElementRef, EventEmitter, inject, Input, Output, QueryList, Signal, SimpleChanges, ViewChild, ViewChildren } from '@angular/core';
import { PopScreenComponent } from '../../../../shared/components/pop-screen/pop-screen.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Product } from '../../../../Interfaces/product';
import { Variant } from '../../../../Interfaces/variant';
import { ProductService } from '../../../../Services/Product/product.service';
import { CommonService } from '../../../../Services/CommonService/common.service';
import { CategoryService } from '../../../../Services/Category/category.service';
import { ToastingMessagesService } from '../../../../Services/ToastingMessages/toasting-messages.service';
import { LanguageService } from '../../../../Services/Language/language.service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { Order } from '../../../../Interfaces/order';

type SaveResult =
  | 'success'
  | 'missing_title'
  | 'missing_Arabic_title'
  | 'missing_price'
  | 'duplicate'
  | 'Duplicate_Arabic_Name'
  | 'Duplicate_English_Name'
  | 'rightVariantsData';
@Component({
  selector: 'app-product-card',
  standalone: false,
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})

export class ProductCardComponent {
  // ViewChild references

  @ViewChild('addCategory') addCategory!: PopScreenComponent;
  @ViewChild('addDetailsAlert') addDetailsAlert!: PopScreenComponent;
  @ViewChild('productTitle') productTitleInput!: InputComponent;
  @ViewChild('productArabicTitle') productArabicTitleInput!: InputComponent;
  @ViewChild('price') productPriceInput!: InputComponent;
  @ViewChild('quantity') productQuantityInput!: InputComponent;

  @ViewChild('productInfo') productInfo!: PopScreenComponent;
  @ViewChild('variantsPopScreen') variantsPopScreen!: PopScreenComponent;
  @Input() cardDisplayDirection:string='catalog'
  // Inputs
  @Input() product!: Product;
  @Input() type:string='';
  @Output() deleteProduct=new EventEmitter<boolean>();
  @Output() checkedProduct=new EventEmitter<{product:Product,checked:boolean}>();
currency:string='SAR';
showCategory:boolean=false;
showDetailsAlert:boolean=false;
showProductInfo:boolean=false;
showVariantPopScreen:boolean=false;

displayCheck!:boolean;
unchecked:boolean=true;
categories!:Signal<Category[]>;
quantityLabel!:string;
variants!:Variant[];
isRtl!:Signal<boolean>;


priceErrorMessage:string='';
englishNameErrorMessage:string='';
arabicNameErrorMessage:string='';
private productService=inject(ProductService);
currentProduct=this.productService.currentProduct;
getVariantDetailsData=this.productService.getVariantDetailsData;
dropdownSelection!: string ;
dropdownSelectionArabic!:string;



  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private __LanguageService:LanguageService,

  ) {
    this.categories=this.categoryService.categories;
    this.isRtl=this.__LanguageService.rtlClassSignal;

    effect(() => {
    this.updateQuantityLabel();
  });
  }

   ngOnInit(): void {
      this.setCategoryInfo()
      this.displayCheck=(!this.type);
      this.updateQuantityLabel();
  }

  ngAfterViewInit() {
   this.currentProduct.set(this.product);
  if(!this.type)
      this.displayProductInfo();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cardDisplayDirection']) {
      setTimeout(() => {
        this.refreshInputsFromProduct();
      });
    }
  }


  private refreshInputsFromProduct(): void {
    if (!this.product || !this.productTitleInput) return;

    this.productTitleInput.value = this.product.nameEn ?? '';
    this.productArabicTitleInput.value = this.product.nameAr ?? '';
    this.productPriceInput.value = this.product.price?.toString() ?? '';

    if (this.product.enfinity) {
      this.productQuantityInput.value = 'Unlimited Quantity';
    } else {
      this.productQuantityInput.value = this.product.quantity?.toString() ?? '';
    }

    this.setCategoryInfo();
  }



updateQuantityLabel(): void {
  this.quantityLabel = `<i class="fa-solid fa-infinity text-secondary pe-2"></i>`;
  if (!this.type) {
    const translated = this.isRtl()? 'متغيرات': "Variants";

    this.quantityLabel += `<div class="d-flex align-self-stretch text-center border-start justify-content-center align-items-center ps-2">
      <span>${translated}</span>
    </div>`;
  }
}

  // Category Functions

  setCategoryInfo() {
    this.dropdownSelection = this.product.categoryNameEn
    ?this.product.categoryNameEn
    : 'Choose Category';
    this.dropdownSelectionArabic = this.product.categoryNameAr
    ?this.product.categoryNameAr
    : 'Choose Category';

}

    chooseCategory(category: Category): void {
      if(category.id)
          this.product.category=category.id;
  }

  closeCreateCategory(category:Category){
    if(category.id){
      this.controlPopScreen('category','close');
      this.dropdownSelection=this.isRtl()? category.nameAr : category.nameEn;
      if( category.id)
      this.product.category=category.id;
    }
    else       this.controlPopScreen('category','close');
  }


  // Product Functions
  displayProductInfo(): void {

  const { nameEn, price, quantity ,nameAr,enfinity} = this.currentProduct() ?? {};
  this.productTitleInput.value = nameEn ?? '';
  this.productArabicTitleInput.value = nameAr ?? '';
  this.productPriceInput.value = price?.toString() ?? '';
  if(enfinity) this.productQuantityInput.value = 'Unlimited Quantity'
  else
    this.productQuantityInput.value = quantity.toString() ?? '';

}

  setProductBasicInfo(title:string,Arabictitle:string,price:string){
        this.product.nameEn= title;
        this.product.nameAr= Arabictitle;
        this.product.price= parseFloat(price);
        if(this.productQuantityInput.value == 'Unlimited Quantity')
        {
          this.product.enfinity=true;
          this.product.quantity=0;
        }
        else
        {this.product.quantity= Number(this.productQuantityInput.value);
          this.product.enfinity=false;
        }
  }

  cancalProduct(): void {
    this.deleteProduct.emit(true);
  }

 openProductDetails(){
    if(!this.product.nameEn)
      this.controlPopScreen('addDetailsAlert');
    else {this.controlPopScreen('productInfo')
      this.setProduct(this.product);
    };
  }

 handleSave() {
    if (!this.type)
      this.updateProduct().subscribe();
    else  this.addProduct().subscribe( );
}


private handleProductSave(action: 'add' | 'update'): Observable<SaveResult> {
  this.emptyBasicInfoErrorMessage();

  const title = this.productTitleInput.value;
  const arabicTitle = this.productArabicTitleInput.value;
  const price = this.productPriceInput.value;

  if (!title) {
    this.englishNameErrorMessage = 'Name is Required';
    return of('missing_title' as SaveResult);
  }
  if (!arabicTitle) {
    this.arabicNameErrorMessage = 'Arabic Name is Required';
    return of('missing_Arabic_title' as SaveResult);
  }
  if (!price) {
    this.priceErrorMessage = 'Price is Required';
    return of('missing_price' as SaveResult);
  }

  this.setProductBasicInfo(title, arabicTitle, price);
  this.currentProduct.update(current => ({
    ...current,
    ...this.product
  }));
  const mappedProduct=this.getUpdateProductMappedValue(this.currentProduct());
  console.log('despite change here but it do not reflect in db');
  // return this.productService.updateProductInfo(this.currentProduct(), action).pipe(
    return this.productService.updateProductInfo(mappedProduct, action).pipe(
    switchMap((result) => {
      if (!result.status) {
        if (result.message === 'Duplicate_Arabic_Name') return of('Duplicate_Arabic_Name' as SaveResult);
        if (result.message === 'Duplicate_English_Name') return of('Duplicate_English_Name' as SaveResult);
        return of('error' as SaveResult);
      }
      return of('success' as SaveResult);
    }),
    catchError(() => of('error' as SaveResult))
  );
}
private getUpdateProductMappedValue(product:Product){
  const{variantMasters,categoryNameAr,categoryNameEn,...mappedProduct}=product;
  if(categoryNameEn)
 { const category=this.categoryService.getCategoryByName(categoryNameEn);
  if(category) mappedProduct['category'] = category.id!;
 }
//  console.log('what is titleEn,tITLE ar');
//  mappedProduct['titleEn']='';
//  mappedProduct['titleAr']='';

 return mappedProduct;
}
private processProductSave(
  action: 'add' | 'update',
): Observable<void> {
  return this.handleProductSave(action).pipe(
    tap((result: SaveResult) => {
      if (result === 'Duplicate_Arabic_Name') {
        this.arabicNameErrorMessage = 'Arabic Name is already Exist';
      }

      if (result === 'Duplicate_English_Name') {
        this.englishNameErrorMessage = 'Name is already Exist';
      }
    }),
    map(() => void 0)
  );
}

addProduct(): Observable<void> {
  return this.processProductSave('add');
}

updateProduct(): Observable<void> {
  return this.processProductSave('update');
}

private emptyBasicInfoErrorMessage(): void {
  this.arabicNameErrorMessage = '';
  this.englishNameErrorMessage = '';
  this.priceErrorMessage = '';
}

saveAdditionalInfo(done:boolean){
    this.closeAdditionalInfoScreen();
    this.product=(this.currentProduct());
    this.updateProduct().subscribe();
}

closeAdditionalInfoScreen(){
      this.controlPopScreen('productInfo','close');
}
setProduct(product:Product){
    this.currentProduct.set(product);
  }
   AddImage(): void {
  }
// Variant control
showVariant(event:boolean){
  this.controlPopScreen('variantsPopScreen');
  this.currentProduct.set(this.product);
  }

controlVariantsPopup(type:string){
    if(type == 'save')
      this.getVariantDetailsData.set(true);
    else
    this.controlPopScreen('variantsPopScreen','close');
}
variantDetailsHandled(){
   this.controlPopScreen('variantsPopScreen','close');
   this.getVariantDetailsData.set(false)
}

// Message functions
controlPopScreen(type: string, action: string = 'open'): void {
  const popScreens = {
    category: { element: this.addCategory, flag: 'showCategory' },
    addDetailsAlert: { element: this.addDetailsAlert, flag: 'showDetailsAlert' },
    productInfo: { element: this.productInfo, flag: 'showProductInfo' },
    variantsPopScreen: { element: this.variantsPopScreen, flag: 'showVariantPopScreen' },
  };

  const config = popScreens[type as keyof typeof popScreens];
  if (!config) return;

  this.commonService.controlPopScreen(config.element, action);
  (this as any)[config.flag] = action === 'open';
}

toggleCheck(product:Product){
    this.unchecked=!this.unchecked;
    this.checkedProduct.emit({product:product,checked: this.unchecked})
  }

}
