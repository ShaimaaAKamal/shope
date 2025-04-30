import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe  } from '@angular/common';


@Pipe({
  name: 'newDate',
  standalone: false
})
export class NewDatePipe implements PipeTransform {

  constructor(private datePipe: DatePipe) {}

  transform(
    value: Date | string | number,
    rtl: boolean = false
  ): string | null {
    if (!value) return null;

    const locale = rtl ? 'ar-EG' : 'en-US';
    return this.datePipe.transform(value, 'EEEE d MMMM y | hh:mm a', undefined, locale);
  }

}
