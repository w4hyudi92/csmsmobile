import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { DetailreturPage } from './../detailretur/detailretur';

/**
 * Generated class for the ListreturPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listretur',
  templateUrl: 'listretur.html',
})
export class ListreturPage {

  public param:any;
  public arr_token: any;
  arrList=[];
  private isi:any;
  isfiltered: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage,
    public loadingCtrl: LoadingController,
  ) {
        this.getData();
        //this.isi = navParams.get("isi");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDraft');
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.getData()
      refresher.complete();
    }, 2000);
  }
  getData() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();

    this.storage.get('prof').then(profile => {
      console.log(profile);
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'part',
          act: 'list_return',
          usr: profile.nik,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        console.log(data);
          if(data['STATUS'] =="SUKSES") {
   
            if(data['data'] == undefined) {
              this.arrList = [];
              this.isfiltered= true;
            }else{
              this.arrList = data['data'];
              this.isfiltered= false;
            }
            loader.dismiss();
          }else{
              this.api.showAlert(data['MESSAGE']);
              loader.dismiss();
          }
      });
    });
  }

  
  select(item) {
        this.navCtrl.push(DetailreturPage, {
        item: item,
        })
    }
  pilihitem(){
      this.navCtrl.push('FormreturPage');
  }
}
