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
import { FtulistronPage } from '../ftulistron/ftulistron';
import { HistoryksPage } from '../historyks/historyks';
import { HistorydetailftuPage } from '../historydetailftu/historydetailftu';
/**
 * Generated class for the FtulistPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ftulist',
  templateUrl: 'ftulist.html',
  providers: [ApiProvider]
})
export class FtulistPage {
  public param:any;
  public arr_token: any;
  arrList=[];
  show: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    private storage: Storage,
    public loadingCtrl: LoadingController,
    private app: App,) {
      
  }

  inputftu(){
    this.app.getRootNav().push(FormftuPage);
  }

  ftulistron(){
    this.app.getRootNav().push(FtulistronPage);
  }

  ionViewDidEnter() {
    this.presentLoading();
  }

  doRefresh(refresher) {
   
    setTimeout(() => {
      this.getData()
      this.events.publish('ftulist:created',Date.now());
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
          mod: 'ftulist',
          act: 'list',
          usr: profile.nik,
          //service_center_id: profile.service_center_id,
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

  viewDetail(item){
    console.log(item);
    this.navCtrl.push(HistorydetailftuPage, {
      isi: item,
    });
  }
}
