import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetailreturPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detailretur',
  templateUrl: 'detailretur.html',
})
export class DetailreturPage {

  public params;
  total:number = 0;
  keterangan: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.params = navParams.get("item").detail;
    console.log(this.params);
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailrentalPage');
    this.hitungtotal();
  }

  hitungtotal(){
    let tot:number = 0
    for(var k = 0; k < this.params.length; k++){
      tot = tot + ( this.params[k]['unitprice_disc'] * this.params[k]['qty_order'])
    }
    this.total = tot;
  }
}
