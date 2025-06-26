import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  standalone: false,
  templateUrl: './layout-header.component.html',
  styleUrl: './layout-header.component.scss'
})
export class LayoutHeaderComponent {
  @Input() page:string='Products'
  dropdownSelection:string='Products';
  selectionMessage:string=this.getMessage('Products');
  searchKey:string='';

  ngOnInit(): void {
    this.dropdownSelection=this.page;
    this.selectionMessage=this.getMessage(this.page);
  }
  changeSelection(action:string){
    this.dropdownSelection=action;
    this.selectionMessage=this.getMessage(action);
  }

  private getMessage(action:string):string{
    switch(action){
      case 'Products' : return 'Search by product name , category name or sku';
      case 'Customers' : return "Search by customer name , phone number";
      case "Orders" : return "Search by order number , customer name";
      case 'Categories' : return "Search by category name";
      case "Variants" : return "Search by variant name , variant type";
      default: return ""
    }
  }

  search(){
    console.log('search apis');
    console.log(this.searchKey);
  }

  showLoyalPoint(){}
  changeTheme(){}
}
