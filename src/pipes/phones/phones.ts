import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the PhonesPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'phones',
})
export class PhonesPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  arr_phones: any = [];
  transform(value: string, ...args) {
    this.arr_phones = value.trim().split(',');
    
    return this.arr_phones;
  }
}
