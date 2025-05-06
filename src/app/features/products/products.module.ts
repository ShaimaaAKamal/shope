import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductsComponent } from './products.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductDetailsPopComponent } from './product-details-pop/product-details-pop.component';
import { VariantsComponent } from './variants/variants.component';
import { AddVariantComponent } from './add-variant/add-variant.component';
import { VariantOptionsValuesQuantityComponent } from './variant-options-values-quantity/variant-options-values-quantity.component';
import { VariantValueDetailsComponent } from './variant-value-details/variant-value-details.component';


@NgModule({
  declarations: [
    ProductsComponent,
    ProductCardComponent,
    ProductDetailsPopComponent,
    VariantsComponent,
    AddVariantComponent,
    VariantOptionsValuesQuantityComponent,
    VariantValueDetailsComponent
  ],
  imports: [
    CommonModule,
    ProductsRoutingModule,
    SharedModule
  ]
})
export class ProductsModule { }
