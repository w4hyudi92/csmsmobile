import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, ViewController,Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-detailinvoice',
  templateUrl: 'detailinvoice.html',
  providers: [ApiProvider]
})
export class DetailinvoicePage {
  public par;
  private param:any;
  private arr_token: any;
  public datanya;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage, 
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public events: Events) {
      this.datanya = navParams.get("item");
    }

}
