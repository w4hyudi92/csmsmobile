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
  selector: 'page-listcekharga',
  templateUrl: 'listcekharga.html',
  providers: [ApiProvider]
})
export class ListcekhargaPage {
  searchTerm: string = '';
  public param:any;
  public arr_token: any;
  arrList=[];
  show: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private app: App,
    public http: HttpClient) {
      this.arrList = []
  }

  ionViewDidLoad() {  
    this.setFilteredItems();  
  }  
  setFilteredItems() {  
    this.arrList = this.filterItems(this.searchTerm);  
  }  

  filterItems(searchTerm){  
    return this.arrList.filter((itm) => {  
      return itm.item_desc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;  
    });     
  } 

  inputftu(){
    this.app.getRootNav().push(ListcekhargaPage);
  }

  ionViewDidEnter() {
    this.presentLoading();
  }

  doRefresh(refresher) {
   
    setTimeout(() => {
      this.getData()
      this.events.publish('cekharga:created',Date.now());
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
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'cekharga',
          act: 'listharga',
          //usr: profile.nik,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          if(data['data'] == undefined) {
            this.arrList = [];
            this.show= false;
          }else{
            this.arrList = data['data'];
            this.show= true;
          }
        }else{
            this.api.showAlert(data['error']['error']);
            this.arrList = [];
            this.show= false;
        }
      });
    });
  }
}
