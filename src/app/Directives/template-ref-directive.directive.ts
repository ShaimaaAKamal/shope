import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appTemplateRef]',
  standalone: false
})
export class TemplateRefDirective {

  @Input('appTemplateRef') name!: string;

  constructor(public template: TemplateRef<any>) {}
}
