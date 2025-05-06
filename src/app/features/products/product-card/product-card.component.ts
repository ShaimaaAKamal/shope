import { ChangeDetectorRef, Component, effect, ElementRef, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';
import { PopScreenComponent } from '../../../shared/components/pop-screen/pop-screen.component';
import { InputComponent } from '../../../shared/components/input/input.component';
import { Product } from '../../../Interfaces/product';
import { Category } from '../../../Interfaces/category';
import { Variant } from '../../../Interfaces/variant';
import { ProductService } from '../../../Services/Product/product.service';
import { CommonService } from '../../../Services/CommonService/common.service';
import { HttpClient } from '@angular/common/http';
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

enterProductInfo!:Product;
  // UI States
  saveVariants:boolean=false;
  dropdownSelection: string = 'Choose Category';
  productId!: number;
  removeProduct: boolean = false;
  // Feedback messages
  message: string = '';
  messageType: string = '';
  errorMessage: string = '';
  displayCheck!:boolean;
  unchecked:boolean=true;
  // Data
categories!:Signal<Category[]>;
 saveInfo:boolean=false;
 quantityLabel!:string;
variants!:Variant[];
isRtl!:Signal<boolean>;
  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private commonService: CommonService,
    private __ToastingMessagesService:ToastingMessagesService,
    private __LanguageService:LanguageService,
    private __TranslationService:TranslateService,
    private cdr: ChangeDetectorRef,

  ) {
    this.productId = this.productService.getProductLength() + 1;
   this.product=this.productService.getProductEmptyValue();
    this.categories=this.categoryService.categories;
    this.isRtl=this.__LanguageService.rtlClassSignal;
    effect(() => {
    const rtl = this.isRtl();
    this.updateQuantityLabel();
  });
  }

  ngOnInit(): void {
      this.displayCheck=(!this.type);
      this.updateQuantityLabel();
  }
  ngAfterViewInit() {

  this.enterProductInfo={...this.product};
  if(!this.type)
   {
      this.displayProductInfo();
     this.cdr.detectChanges();
   }
  }

// updateQuantityLabel(): void {
//   this.quantityLabel = `<i class="fa-solid fa-infinity text-secondary pe-2"></i>`;
//   if (!this.type) {
//     this.quantityLabel += `<div class="d-flex align-self-stretch text-center border-start justify-content-center align-items-center ps-2">
//       <span>Variants</span>
//     </div>`;
//   }
// }
updateQuantityLabel(): void {
  this.quantityLabel = `<i class="fa-solid fa-infinity text-secondary pe-2"></i>`;
  if (!this.type) {
    const translated = this.__TranslationService.instant('Variants');
    console.log(translated);
    this.quantityLabel += `<div class="d-flex align-self-stretch text-center border-start justify-content-center align-items-center ps-2">
      <span>${translated}</span>
    </div>`;
  }
}
controlPopScreen(type:string,action:string='open'){
  switch(type){
    case'category': this.commonService.controlPopScreen(this.addCategory,action);
    this.showCategory=(action=='open') ?true:false;
    break;
    case'addDetailsAlert': this.commonService.controlPopScreen(this.addDetailsAlert,action);
    this.showDetailsAlert=(action=='open') ?true:false;
    break;
     case'productInfo': this.commonService.controlPopScreen(this.productInfo,action);
     this.showProductInfo=(action=='open') ?true:false;
    break;
     case'variantsPopScreen': this.commonService.controlPopScreen(this.variantsPopScreen,action);
     this.showVariantPopScreen=(action=='open') ?true:false;
    break;
    default:break;
  }
}

  // Category Functions
  chooseCategory(category: Category): void {;
    if (this.product) {
      this.product.category = category;
    }
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

  const { name, price, quantity, category } = this.product ?? {};

  this.productTitleInput.value = name ?? '';
  this.productPriceInput.value = price?.toString() ?? '';
  this.productQuantityInput.value = quantity ?? '';
  if(category)
  this.dropdownSelection = category.name;
}

  setProductBasicInfo(title:string,price:string){
      this.product.name = title;
      this.product.price = parseFloat(price);
      this.product.quantity = this.productQuantityInput.value;
  }

  cancalProduct(): void {
    this.deleteProduct.emit(true);
  }

 openProductDetails(){
    if(this.type)
      this.controlPopScreen('addDetailsAlert');
    else this.controlPopScreen('productInfo');
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

  const isSaved = this.productService.updateProductInfo(this.product);
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
      this.type = '';
      this.updateQuantityLabel();
      // this.updateType.emit();
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
saveProductDetails(){
   this.saveInfo=true;
}

saveAdditionalInfo(done:boolean){
  if(done)     {this.controlPopScreen('productInfo','close');this.saveInfo=false; this.cdr.detectChanges(); }
}
  // Utility
  private showMessage(message: string, type: string): void {
    this.message = message;
    this.messageType = type;
      this.cdr.detectChanges();
  }

  // Variant control
  showVariant(event:boolean){
    this.saveVariants=false;
    this.controlPopScreen('variantsPopScreen');
  }

  closeVraianTpopScreen(){
   if(!this.saveVariants){
     this.product={...this.enterProductInfo} ;
    this.variants=[...this.enterProductInfo.variants ?? []]
   }
  }

saveProductVariants(){
  if(this.product.variants?.length ==0 )
      this.updatedVariants(true);
  else   this.saveVariants=true;
  this.controlPopScreen('variantsPopScreen','close');
}


updatedVariants(uodate:boolean){
const result= this.productService.updateProductInfo(this.product);
if(result) this.enterProductInfo={...this.product}
this.showUpdateStatusMessages(result);
}

showUpdateStatusMessages(updated: boolean): void {
  const message = updated ? 'Variant has been saved successfully' : 'Something went wrong';
  const type = updated ? 'success' : 'error';
  this.showMessage(message, type);
}
 closeMessage(): void {
    this.message='';
    this.messageType='';
}

  toggleCheck(product:Product){
    this.unchecked=!this.unchecked;
  }

   closeProductPopscreen():void{
    //clear product info here
  }





   AddImage(): void {
  }

}

