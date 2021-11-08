import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CariRentalPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cariRental',
})
export class CariRentalPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
  
    return items.filter((item) => {
        console.log(item);
        if(item.transfer_dok.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
    });

  }
}
