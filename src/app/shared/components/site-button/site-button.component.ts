import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-site-button',
  standalone: false,
  templateUrl: './site-button.component.html',
  styleUrl: './site-button.component.scss'
})
export class SiteButtonComponent {
@Input() BtnData={
  BtnName:'',
  route:'',
  iconDir:''
}
}
