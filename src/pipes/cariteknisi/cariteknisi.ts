import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CariteknisiPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'cariteknisi',
})
export class CariteknisiPipe implements PipeTransform {
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
  
    return items.filter((item) => {
        console.log(item);
        if(item.pengguna_id.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
        if(item.nama_teknisi.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }
    });

  }
}
