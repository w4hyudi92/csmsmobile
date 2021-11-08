import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ShareProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ShareProvider {

  private tab1BadgeCount: any;
  constructor(public http: HttpClient) {
    console.log('Hello ShareProvider Provider');
  }

  countbadge() {
    return this.tab1BadgeCount;
  }
}
