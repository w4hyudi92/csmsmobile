import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';


@IonicPage()
@Component({
  selector: 'page-listteknisi',
  templateUrl: 'listteknisi.html',
  providers: [ApiProvider]
})
export class ListteknisiPage {

  public param:any;
  public arr_token: any;
  arrList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage,) {
  }

  ionViewDidLoad() {
    this.presentLoading();
  }

  getData() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'device',
          act: 'list',
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        if(data['data'] == undefined) {
          this.arrList = [];
        }else{
          this.arrList = data['data'];
        }
        loader.dismiss();
      });
    });
  }


  presentLoading() {
    this.getData();
  }

}
