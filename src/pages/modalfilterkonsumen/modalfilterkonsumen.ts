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
  templateUrl: 'modalfilterkonsumen.html',
})
export class ModalfilterkonsumenPage {

  katakunci: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalfilterkonsumenPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  carilahcuy(){

    this.navParams.get('content').katakunci = this.katakunci;
    this.viewCtrl.dismiss();
  }

}
