import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { FormksPage } from '../formks/formks';


@IonicPage()
@Component({
  selector: 'page-listwo',
  templateUrl: 'historyks.html',
  providers: [ApiProvider]
})
export class HistoryksPage {
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
    this.setFilteredItems();
    this.presentLoading();  
  }  

  setFilteredItems() {  
    this.arrList = this.filterItems(this.searchTerm);  
  }

  filterItems(searchTerm){  
    return this.arrList.filter((itm) => {  
      return itm.nama_konsumen.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;  
    });     
  } 

  doRefresh(refresher) {
   
    setTimeout(() => {
      this.getData()
      this.events.publish('list_ks:created',Date.now());
      refresher.complete();
    }, 2000);
  }

  select(item) {
      this.navCtrl.push(FormksPage, {
        item: item,
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
          mod: 'list_ks',
          act: 'daftarks',
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
