import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetailnotifikasiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailnotifikasi',
  templateUrl: 'detailnotifikasi.html',
})
export class DetailnotifikasiPage {

  isi:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.isi = navParams.get("isi");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailnotifikasiPage');
  }

}
