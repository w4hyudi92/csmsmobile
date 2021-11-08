import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the MenuksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menuinformation',
  templateUrl: 'menuinformation.html',
})
export class MenuinformationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: ApiProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuksPage');
  }

  /*infokonsumen(){
    this.api.showAlert('Sedang dalam pengembangan');
  }*/
  listservicebulletin(){
    this.navCtrl.push('ListservicebulletinPage');
  }
  listtechnicalforum(){
    this.navCtrl.push('ListtechnicalforumPage');
  }

}