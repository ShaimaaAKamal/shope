import {  Component, effect, ElementRef, EventEmitter, inject, Input, Output, Signal, ViewChild } from '@angular/core';
import { PopScreenComponent } from '../../../../shared/components/pop-screen/pop-screen.component';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { Product } from '../../../../Interfaces/product';
import { Category } from '../../../../Interfaces/category';
import { Variant } from '../../../../Interfaces/variant';
import { ProductService } from '../../../../Services/Product/product.service';
import { CommonService } from '../../../../Services/CommonService/common.service';
import { CategoryService } from '../../../../Services/Category/category.service';
import { ToastingMessagesService } from '../../../../Services/ToastingMessages/toasting-messages.service';
import { LanguageService } from '../../../../Services/Language/language.service';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';

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
  @ViewChild('CategoryName') categoryNameInput!: InputComponent;
  @ViewChild('CategoryArabicName') CategoryArabicName!: InputComponent;
  @ViewChild('addDetailsAlert') addDetailsAlert!: PopScreenComponent;
  @ViewChild('productTitle') productTitleInput!: InputComponent;
  @ViewChild('productArabicTitle') productArabicTitleInput!: InputComponent;
  @ViewChild('price') productPriceInput!: InputComponent;
  @ViewChild('quantity') productQuantityInput!: InputComponent;
  @ViewChild('productInfo') productInfo!: PopScreenComponent;
  @ViewChild('variantsPopScreen') variantsPopScreen!: PopScreenComponent;

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

errorMessage: string = '';
errorArabicrMessage:string='';
priceErrorMessage:string='';
englishNameErrorMessage:string='';
arabicNameErrorMessage:string='';
private productService=inject(ProductService);
currentProduct=this.productService.currentProduct;
getVariantDetailsData=this.productService.getVariantDetailsData;
dropdownSelection!: string ;
  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private __ToastingMessagesService:ToastingMessagesService,
    private __LanguageService:LanguageService,

  ) {
    this.categories=this.categoryService.categories;
    this.isRtl=this.__LanguageService.rtlClassSignal;

    effect(() => {
    this.updateQuantityLabel();
  });
  }

  ngOnInit(): void {
      this.dropdownSelection = this.product.category ?  this.product.category.name : 'Choose Category';
      this.displayCheck=(!this.type);
      this.updateQuantityLabel();
  }
  ngAfterViewInit() {
   this.currentProduct.set(this.product);
  if(!this.type)
      this.displayProductInfo();
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
  chooseCategory(category: Category): void {
     this.product.category=category;
  }

  createCategory(): void {
    const categoryName = this.categoryNameInput.value;
    const categoryArabicName = this.CategoryArabicName.value;
    const result = this.categoryService.createCategory(categoryName,categoryArabicName);

    if (result.status) {
      this.clearCategoryForm();
      this.controlPopScreen('category','close');
      this.dropdownSelection=this.isRtl()? categoryArabicName : categoryName;
      this.product.category=result.catergory;

    } else {
      this.errorMessage =( result.errorType == "missing_Name" || result.errorType == "already_Exist" )?result.message : '';
      this.errorArabicrMessage = result.errorType == "missing_Arabic_Name" ?result.message : '';
    }
  }

  clearCategoryForm(): void {
    this.clearErrorMessage();
    this.categoryNameInput.value = '';
  }
  clearErrorMessage(){
    this.errorMessage = '';
    this.arabicNameErrorMessage=''
   }

  // Product Functions
  displayProductInfo(): void {

  const { name, price, quantity ,nameAr} = this.currentProduct() ?? {};
  this.productTitleInput.value = name ?? '';
  this.productArabicTitleInput.value = nameAr ?? '';
  this.productPriceInput.value = price?.toString() ?? '';
  this.productQuantityInput.value = quantity ?? '';
}

  setProductBasicInfo(title:string,Arabictitle:string,price:string){
        this.product.name= title,
        this.product.nameAr= Arabictitle,
        this.product.price= parseFloat(price),
        this.product.quantity= this.productQuantityInput.value

  }

  cancalProduct(): void {
    this.deleteProduct.emit(true);
  }

 openProductDetails(){
    if(!this.product.name)
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

  return this.productService.updateProductInfo(this.currentProduct(), action).pipe(
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
    this.controlPopScreen('productInfo','close');
    this.product=(this.currentProduct());
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
     if(type=='save') {
      if(this.currentProduct()?.variants?.length == 0 && this.product.variants?.length == 0)
          this.controlPopScreen('variantsPopScreen','close');
      else{
              this.product=this.currentProduct();
             this.getVariantDetailsData.set(true);
      }
     }
     else     this.controlPopScreen('variantsPopScreen','close');
 }
variantDetailsHandled(){
   this.controlPopScreen('variantsPopScreen','close');
   this.getVariantDetailsData.set(false);
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

showUpdateStatusMessages(updated: boolean): void {
  const message = updated ? 'Variant has been saved successfully' : 'Something went wrong';
  const type = updated ? 'success' : 'error';
  this.__ToastingMessagesService.showToast(message,type);
}

toggleCheck(product:Product){
    this.unchecked=!this.unchecked;
    this.checkedProduct.emit({product:product,checked: this.unchecked})
  }

}
