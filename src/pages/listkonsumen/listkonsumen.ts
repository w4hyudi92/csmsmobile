import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Events, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { FormksPage } from '../formks/formks';
import { FormksaddPage } from '../formksadd/formksadd';


@IonicPage()
@Component({
  selector: 'page-listkonsumen',
  templateUrl: 'listkonsumen.html',
  providers: [ApiProvider]
})
export class ListkonsumenPage {
  searchTerm: string = '';
  public param:any;
  public arr_token: any;
  arrList=[];
  namatelp: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    public modalCtrl: ModalController,
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
      this.events.publish('list_ks:created',Date.now());
      refresher.complete();
    }, 2000);
  }

  select(item) {
      this.navCtrl.push(FormksaddPage, {
        item: item,
      })
  }

  cari(){
    this.getKonsumen();
  }

  getKonsumen() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'list_ks',
          cust: this.namatelp,
          service_center_id: profile.service_center_id,
          act: 'listkonsumen',
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

  carikonsumen(){
    let modal = this.modalCtrl.create('ModalfilterkonsumenPage',
      {
        content: this,
      });
    modal.onDidDismiss(() => {
      this.presentLoading()
      });
    modal.present();
  }

  presentLoading() {
    // this.getKonsumen();
  }

}
