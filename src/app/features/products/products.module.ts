import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { SharedModule } from '../../shared/shared.module';
import { AddVariantComponent } from './components/add-variant/add-variant.component';
import { CreateVariantComponent } from './components/create-variant/create-variant.component';
import { ProductDetailsPopComponent } from './components/product-details-pop/product-details-pop.component';
import { VariantsComponent } from './components/variants/variants.component';
import { VariantOptionsValuesQuantityComponent } from './components/variant-options-values-quantity/variant-options-values-quantity.component';
import { VariantValueDetailsComponent } from './components/variant-value-details/variant-value-details.component';
import { VariantsLibraryComponent } from './variants-library/variants-library.component';
import { EditVariantComponent } from './edit-variant/edit-variant.component';
import { ColorPickingComponent } from './components/color-picking/color-picking.component';
import { VariantLibraryItemComponent } from './variant-library-item/variant-library-item.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryComponent } from './categories/category/category.component';
import { CategoryCardComponent } from './categories/category-card/category-card.component';
import { VariantTypeCenterComponent } from './variant-type-center/variant-type-center.component';
import { VariantTypeComponent } from './variant-type-center/variant-type/variant-type.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductCardComponent,
    ProductDetailsPopComponent,
    VariantsComponent,
    AddVariantComponent,
    VariantOptionsValuesQuantityComponent,
    VariantValueDetailsComponent,
    CreateVariantComponent,
    VariantsLibraryComponent,
    EditVariantComponent,
    ColorPickingComponent,
    VariantLibraryItemComponent,
    CategoriesComponent,
    CategoryComponent,
    CategoryCardComponent,
    VariantTypeCenterComponent,
    VariantTypeComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ],
})
export class ProductsModule { }
