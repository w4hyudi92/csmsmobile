import { Component } from '@angular/core';
import { App, LoadingController, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { MenusetorPage } from '../menusetor/menusetor';

@IonicPage()
@Component({
  selector: 'page-detailsetor',
  templateUrl: 'detailsetor.html',
  providers: [ApiProvider]
})
export class DetailSetorPage {
  private isi: any;
  private par: any;
  private qr: any;
  public param:any;
  public arr_token: any;
  arrList = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    private app: App) {
      this.isi = navParams.get("isi");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailSetorPage');
    this.getData();
    this.getDataTotal();
    this.lihatbarcode();
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
          mod: 'setor_tunai',
          act: 'detailsetor',
          nosetor: this.isi['nomorsetor'],
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
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
  
  lihatbarcode() {
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'setor_tunai',
          act: 'lihatbarcode',
          nosetor: this.isi['nomorsetor'],
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      this.api.getApi(this.param).then(data => 
      {
        if(data['data'] == undefined) {
          this.qr = "";
        }
      });
    });
  }

  getDataTotal() {
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'setor_tunai',
          act: 'detailsetor_total',
          nosetor: this.isi['nomorsetor'],
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      this.api.getApi(this.param).then(data => 
      {
        if(data['data'] == undefined) {
          this.par = "";
        }else{
          this.par = data['data'];
        }
      });
    });
  }

  reloadpage(){
    this.presentLoading();
    this.app.getRootNav().push(MenusetorPage);
  }

  presentLoading() {
    this.getData();
    this.getDataTotal();
    this.lihatbarcode();
  }

}
