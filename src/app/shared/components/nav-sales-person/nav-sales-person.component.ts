import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-nav-sales-person',
  standalone: false,
  templateUrl: './nav-sales-person.component.html',
  styleUrl: './nav-sales-person.component.scss'
})
export class NavSalesPersonComponent {
@Input() isCollapsed:boolean=false;
@Input() personImage:string='';
@Input() salesPersonName:string=''
}
