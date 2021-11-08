import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CariinvoicePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cariinvoice',
})
export class CariinvoicePipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
  
    return items.filter((item) => {
        console.log(item);
        if(item.NAMECUST.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
    });

  }
}
