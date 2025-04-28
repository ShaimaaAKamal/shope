import { Component, inject, Input } from '@angular/core';
import { LanguageService } from '../../../Services/Language/language.service';

@Component({
  selector: 'app-nav-sales-person',
  standalone: false,
  templateUrl: './nav-sales-person.component.html',
  styleUrl: './nav-sales-person.component.scss'
})
export class NavSalesPersonComponent {
@Input() isCollapsed:boolean=false;
@Input() personImage:string='';
@Input() salesPersonName:string='';
private __LanguageService=inject(LanguageService);
isRtl=this.__LanguageService.rtlClassSignal;
}
