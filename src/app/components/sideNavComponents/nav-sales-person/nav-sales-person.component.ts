import { Component, Input } from '@angular/core';

interface NavSalesPersonInterface{
  isCollapsed:boolean,
  personImage:string,
  salesPersonName:string
}
@Component({
  selector: 'app-nav-sales-person',
  standalone: false,
  templateUrl: './nav-sales-person.component.html',
  styleUrl: './nav-sales-person.component.scss'
})
export class NavSalesPersonComponent {
@Input() NavSalesPersonComponent:NavSalesPersonInterface={
  isCollapsed:false,
  personImage:'',
  salesPersonName:''
}

}
