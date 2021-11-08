import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { FormksPage } from '../formks/formks';
import { DetailSetorPage } from '../detailsetor/detailsetor';


@IonicPage()
@Component({
  selector: 'papage-historisetorge-listwo',
  templateUrl: 'historisetor.html',
  providers: [ApiProvider]
})
export class HistorisetorPage {
  searchTerm: string = '';
  public param:any;
  public arr_token: any;
  arrList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    public loadingCtrl: LoadingController,
    private storage: Storage,) {
  }

  ionViewDidLoad() {  
    this.presentLoading();  
  }  

  doRefresh(refresher) {
   
    setTimeout(() => {
      this.getData()
      this.events.publish('list_ks:created',Date.now());
      refresher.complete();
    }, 2000);
  }

  select(item) {
      this.navCtrl.push(DetailSetorPage, {
        isi: item,
      })
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
          act: 'historisetor',
          usr: profile.nik,
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
