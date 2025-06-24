import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { VariantsLibraryComponent } from './variants-library/variants-library.component';
import { CategoriesComponent } from './categories/categories.component';

const routes: Routes = [{ path: '', component: ProductsComponent },
    {path:'Variants_Library',component:VariantsLibraryComponent},
    {path:'Categories',component:CategoriesComponent},

];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
 }
