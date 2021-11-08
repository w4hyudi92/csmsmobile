import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CariRonPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cariRon',
})
export class CariRonPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
  
    return items.filter((item) => {
        console.log(item);
        if(item.nomor_ron.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
    });

  }
}
