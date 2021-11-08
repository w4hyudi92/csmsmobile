import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HistorijualpartPage } from '../historijualpart/historijualpart';

/**
 * Generated class for the MenupartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menupart',
  templateUrl: 'menupart.html',
})
export class MenupartPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenupartPage');
  }

  jualpart(){
    this.navCtrl.push('JualPart');
  }
  pilihitem(){
    this.navCtrl.push('FormrtlPage');
  }
  historijualpart(){
    this.navCtrl.setRoot(HistorijualpartPage);
  }
  partsaya() {
    this.navCtrl.push('MypartPage');
  }
  mylist(){
    this.navCtrl.push('ListrentalPage');
  }
  infolimit(){
    this.navCtrl.push('InfolimitPage');
  }
  retur(){
    this.navCtrl.push('ListreturPage');
  }
}
