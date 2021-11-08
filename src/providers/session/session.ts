import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';

/*
  Generated class for the SessionProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class SessionProvider {

  constructor(public http: HttpClient,
    private storage: Storage,
    private device: Device) {
    console.log('Hello SessionProvider Provider');
  }

}
