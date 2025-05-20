import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductsComponent } from './products.component';
import { VariantsLibraryComponent } from './variants-library/variants-library.component';

const routes: Routes = [{ path: '', component: ProductsComponent },
    {path:'Variants_Library',component:VariantsLibraryComponent},
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductsRoutingModule {
 }
