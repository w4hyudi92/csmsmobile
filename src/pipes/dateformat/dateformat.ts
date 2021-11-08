import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';
/**
 * Generated class for the DateformatPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'dateformat',
})
export class DateformatPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: string) {
    var datePipe = new DatePipe("en-US");
     value = datePipe.transform(value, 'dd MMM yyyy hh:mm');
     return value;
 }
}
