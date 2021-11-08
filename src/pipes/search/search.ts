import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], terms: string): any[] {
    if(!items) return [];
    if(!terms) return items;
  
    return items.filter((item) => {
        console.log(item);
        if(item.nomor_ron.toLowerCase().indexOf(terms.toLowerCase()) > -1)
        {
            return true;
        }else if(item.nama_konsumen.toLowerCase().indexOf(terms.toLowerCase()) > -1){
            return true;
        }else if(item.jadwal_tanggal.toLowerCase().indexOf(terms.toLowerCase()) > -1){
            return true;
        }else{
            return false;
        }
    });

  }
}
