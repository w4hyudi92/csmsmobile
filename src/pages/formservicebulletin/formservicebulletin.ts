import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Events  } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the Formservicebulletin page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formservicebulletin',
  templateUrl: 'formservicebulletin.html',
})
export class FormservicebulletinPage {

  public param:any;
  public arr_token: any;
  arrList=[];
  show: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    private storage: Storage,
    public loadingCtrl: LoadingController,) {
      
  }

  ionViewDidLoad() {
    //this.presentLoading();
  }

  ionViewDidEnter() {
    this.presentLoading();
  }

  doRefresh(refresher) {
   
    setTimeout(() => {
      this.getData()
      this.events.publish('service_bulletin:created',Date.now());
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
          mod: 'service_bulletin',
          act: 'koleksi',
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

  dibaca(itm){
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'service_bulletin',
        act: 'lihat',
        id: itm.service_bulletin_id,
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => 
    {

        if(data['STATUS'] =="SUKSES") {
          this.events.publish('service_bulletin:created',Date.now());
          this.presentLoading();
          //if(itm.konten.substring(6,9)=="RON"){
            this.storage.get('prof').then(profile => {
              //this.param['params']['usr'] = profile.nik;
              //this.param['params']['act'] ='cari';
              //this.param['params']['mod'] ='list_ron';
              //this.param['params']['ron'] = itm.konten.substring(6,21);
            
              this.api.getApi(this.param).then(datas => 
              {
                  if(datas['STATUS'] =="SUKSES") {
                    this.navCtrl.push(FormservicebulletinPage, {
                      item: datas['data'][0],
                    });
                  }else{
                      this.api.showAlert(datas['error']['text']);
                  }
              });
            });
          //}       
        }else{
          this.api.showAlert(data['error']['error']);
        }
    });
  }
}
