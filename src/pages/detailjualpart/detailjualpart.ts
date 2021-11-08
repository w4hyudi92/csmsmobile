import { Component } from '@angular/core';
import { LoadingController, Events, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-detailjualpart',
  templateUrl: 'detailjualpart.html',
  providers: [ApiProvider]
})
export class DetailJualPartPage {
  private isi: any;
  private par: any;
  public param:any;
  public arr_token: any;
  arrList = [];
  private midtransArr: any;

  total: number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
      this.isi = navParams.get("isi");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailJualPartPage');
    this.getData();
    this.getDataTotal();
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
          mod: 'part',
          act: 'midtranspart',
          nojual: this.isi['part_sales_doc'],
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      this.api.getApi(this.param).then(data => 
      {
        if(data['data'] == undefined) {
          this.midtransArr = "";
        }else{
          this.midtransArr = data['data'];
          // console.log(this.par);
        }
        loader.dismiss();
      });
    });
  }

  getDataTotal() {
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'part',
          act: 'detailjualpart',
          nosetor: this.isi['part_sales_doc'],
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
          // console.log(this.arrList);
          let tot:number = 0
          for(var k = 0; k < this.arrList.length; k++){
            tot = tot + ( this.arrList[k]['saleprice'] * this.arrList[k]['sale_qty'])
          }
          this.total = tot;
          console.log(this.total);
        }
        
      });
    });
  }

  presentLoading() {
    this.getData();
    this.getDataTotal();
  }

}
