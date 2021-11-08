import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CariksPage pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cariks',
})
export class CariksPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
  
    return items.filter((item) => {
        console.log(item);
        if(item.no_ks.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
        if(item.telepon.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
    });

  }
}
