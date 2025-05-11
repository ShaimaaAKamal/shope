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


@NgModule({
  declarations: [
    ProductsComponent,
    ProductCardComponent,
    ProductDetailsPopComponent,
    VariantsComponent,
    AddVariantComponent,
    VariantOptionsValuesQuantityComponent,
    VariantValueDetailsComponent,
    CreateVariantComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ],
})
export class ProductsModule { }
