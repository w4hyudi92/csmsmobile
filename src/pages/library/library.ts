import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the LibraryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-library',
  templateUrl: 'library.html',
})
export class LibraryPage {

  admin:number;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.admin = navParams.get("admin");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LibraryPage');
  }
  bukafolder(text){
    this.navCtrl.push('LibraryDetailPage',{
      folder: text,
      admin: this.admin
    });
  }
}
