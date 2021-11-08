import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CariPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cari',
})
export class CariPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
  
    return items.filter((item) => {
        console.log(item);
        if(item.item_desc.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
        if(item.itemno.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
    });

  }
}
