import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { VariantsLibraryComponent } from './variants-library/variants-library.component';
import { CategoriesComponent } from './categories/categories.component';
import { VariantTypeCenterComponent } from './variant-type-center/variant-type-center.component';

const routes: Routes = [{ path: '', component: ProductsComponent },
    {path:'Variants_Library',component:VariantsLibraryComponent},
    {path:'Categories',component:CategoriesComponent},
    {path:'VartiantTypes',component:VariantTypeCenterComponent}
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
 }
