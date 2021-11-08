import { Component } from '@angular/core';
import { App, LoadingController, IonicPage, NavController, NavParams,Events, ModalController } from 'ionic-angular';
import { FormwoPage } from './../formwo/formwo';
import { FormftuPage } from './../formftu/formftu';
import { FirebasePage } from './../firebase/firebase';
import { StoryservicePage } from './../storyservice/storyservice';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import * as moment from 'moment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
/**
 * Generated class for the listcekhargaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Injectable()
@Component({
  selector: 'page-modalhistoripending',
  templateUrl: 'modalhistoripending.html',
  providers: [ApiProvider]
})
export class ModalHistoriPending {
  public param:any;
  public arr_token: any;
  public datanya;
  arrPendingDetail = [];
  show: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private app: App,
    public http: HttpClient,
    public modalController: ModalController) {
      this.arrPendingDetail = [];
      this.datanya = navParams.get("item");
  }

  ionViewDidLoad() {  
  }  

  ionViewDidEnter() {
    this.presentLoading();
  }

  doRefresh(refresher) {
   
    setTimeout(() => {
      this.getData()
      this.events.publish('listinvoice:created',Date.now());
      refresher.complete();
    }, 2000);
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.getData();
    loader.dismiss();
  }

  getData() {
    console.log('Data Histori ID: '+this.datanya['histori_mobile_id']);
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'historikunjungan_pending',
        act: 'pendingdetail',
        histori_mobile_id: this.datanya['histori_mobile_id'],
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => 
    {
      if(data['STATUS'] =="SUKSES") {
        if(data['data'] == undefined) {
          this.arrPendingDetail = [];
          this.show= false;
        }else{
          this.arrPendingDetail = data['data'];
          this.show= true;
        }
      }else{
          this.api.showAlert("Server tidak merespon!");
          this.arrPendingDetail = [];
          this.show= false;
      }
    });
  }
}
