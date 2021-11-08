import { Component } from '@angular/core';
import { ViewController, IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the ModalfilterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalfilter',
  templateUrl: 'modalfilter.html',
})
export class ModalfilterPage {

  tanggal: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalfilterPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  onChangeTanggal(event) {
    this.tanggal = (event.day<10 ? '0'+event.day : event.day) + '/' + (event.month<10 ? '0'+event.month : event.month) + '/' + event.year;
  }
  pilih(){

    this.navParams.get('content').tanggal = this.tanggal;
    this.viewCtrl.dismiss();
  }

}
