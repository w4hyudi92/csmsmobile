import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the SearchtglPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'searchtgl',
})
export class SearchtglPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(items: any[], terms: string): any[] {
    
    if(!items) return [];
    if(!terms) return items;
    
    return items.filter((item) => item.tanggal.indexOf(terms) > -1);

  }
}
