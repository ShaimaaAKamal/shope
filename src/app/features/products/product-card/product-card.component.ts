import {  Component, effect, ElementRef, EventEmitter, inject, Input, Output, Signal, ViewChild } from '@angular/core';
import { PopScreenComponent } from '../../../shared/components/pop-screen/pop-screen.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Product } from '../../../Interfaces/product';
import { Category } from '../../../Interfaces/category';
import { Variant } from '../../../Interfaces/variant';
import { ProductService } from '../../../Services/Product/product.service';
import { CommonService } from '../../../Services/CommonService/common.service';
import { CategoryService } from '../../../Services/Category/category.service';
import { ToastingMessagesService } from '../../../Services/ToastingMessages/toasting-messages.service';
import { LanguageService } from '../../../Services/Language/language.service';
import { TranslateService } from '@ngx-translate/core';
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
  @ViewChild('price') productPriceInput!: InputComponent;
  @ViewChild('quantity') productQuantityInput!: InputComponent;
  @ViewChild('productInfo') productInfo!: PopScreenComponent;
  @ViewChild('variantsPopScreen') variantsPopScreen!: PopScreenComponent;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Inputs
  @Input() product!: Product;
  @Input() type:string='';
  @Output() deleteProduct=new EventEmitter<boolean>();

showCategory:boolean=false;
showDetailsAlert:boolean=false;
showProductInfo:boolean=false;
showVariantPopScreen:boolean=false;
errorMessage: string = '';
displayCheck!:boolean;
unchecked:boolean=true;
categories!:Signal<Category[]>;
quantityLabel!:string;
variants!:Variant[];
isRtl!:Signal<boolean>;

private productService=inject(ProductService);
currentProduct=this.productService.currentProduct;
getVariantDetailsData=this.productService.getVariantDetailsData;
dropdownSelection!: string ;
  constructor(
    private categoryService: CategoryService,
    private commonService: CommonService,
    private __ToastingMessagesService:ToastingMessagesService,
    private __LanguageService:LanguageService,
    private __TranslationService:TranslateService,

  ) {
    this.categories=this.categoryService.categories;
    this.isRtl=this.__LanguageService.rtlClassSignal;
    effect(() => {
    const rtl = this.isRtl();
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
  // this.enterProductInfo={...this.product};
  if(!this.type)
   {
      this.displayProductInfo();
   }
  }
updateQuantityLabel(): void {
  this.quantityLabel = `<i class="fa-solid fa-infinity text-secondary pe-2"></i>`;
  if (!this.type) {
    const translated = this.__TranslationService.instant('Variants');
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
    } else {
      this.errorMessage = result.message;
    }
  }

  clearCategoryForm(): void {
    this.clearErrorMessage();
    this.categoryNameInput.value = '';
  }
  clearErrorMessage(){
    this.errorMessage = '';
  }

  // Product Functions
  displayProductInfo(): void {
  if (!this.productTitleInput || !this.productPriceInput || !this.productQuantityInput) {
    console.warn('Input components are not available yet');
    return;
  }

  const { name, price, quantity } = this.currentProduct() ?? {};
  this.productTitleInput.value = name ?? '';
  this.productPriceInput.value = price?.toString() ?? '';
  this.productQuantityInput.value = quantity ?? '';
}

  setProductBasicInfo(title:string,price:string){
        this.product.name= title,
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

 handleSave(){
    if(!this.type) this.updateProduct();
    else this.addProduct();
  }

private handleSaveResult(
  result: 'success' | 'missing_title' | 'missing_price' | 'duplicate',
  messages: {
    success: string;
    duplicate: string;
  },
  onSuccess?: () => void,
  onDuplicate?: () => void
): void {
  switch (result) {
    case 'missing_title':
      this.__ToastingMessagesService.showToast('Product Title Field Is Required', 'error');
      break;
    case 'missing_price':
      this.__ToastingMessagesService.showToast('Product Price Field Is Required', 'error');
      break;
    case 'duplicate':
      if (onDuplicate) onDuplicate();
      this.__ToastingMessagesService.showToast(messages.duplicate, 'error');
      break;
    case 'success':
      if (onSuccess) onSuccess();
      this.__ToastingMessagesService.showToast(messages.success, 'success');
      break;
  }
}
private handleProductSave(): 'success' | 'missing_title' | 'missing_price' | 'duplicate' {
  const title = this.productTitleInput.value;
  const price = this.productPriceInput.value;

  if (!title) return 'missing_title';
  if (!price) return 'missing_price';

  this.setProductBasicInfo(title, price);
    this.currentProduct.update(current => ({
        ...current,
      ...this.product
      }));
  const isSaved = this.productService.updateProductInfo(this.currentProduct());
  // const isSaved = this.productService.updateProductInfo(this.product);
  return isSaved ? 'success' : 'duplicate';
}

addProduct(): void {
  const result = this.handleProductSave();

  this.handleSaveResult(
    result,
    {
      success: 'Product has been added successfully',
      duplicate: 'Product already exists',
    },
    () => {
      this.displayCheck = true;
      this.updateQuantityLabel();
    },
    () => {
      this.displayCheck = false;
    }
  );
}

updateProduct(): void {

  const result = this.handleProductSave();
  this.handleSaveResult(
    result,
    {
      success: 'Product data has been saved successfully',
      duplicate: "Product data hasn't been saved successfully",
    }
  );
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
     if(type=='save') {    this.product=this.currentProduct();
       this.getVariantDetailsData.set(true);
     }
     else     this.controlPopScreen('variantsPopScreen','close');
 }
variantDetailsHandled(){
   this.getVariantDetailsData.set(false);
    this.controlPopScreen('variantsPopScreen','close');
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
  }


}
