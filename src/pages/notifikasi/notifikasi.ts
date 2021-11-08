import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, Events  } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { FormwoPage } from './../formwo/formwo';
/**
 * Generated class for the NotifikasiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notifikasi',
  templateUrl: 'notifikasi.html',
})
export class NotifikasiPage {

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
      this.events.publish('notifikasi:created',Date.now());
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
          mod: 'notifikasi',
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
        mod: 'notifikasi',
        act: 'update_baca',
        id: itm.id,
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => 
    {

        if(data['STATUS'] =="SUKSES") {
          this.events.publish('notifikasi:created',Date.now());
          this.presentLoading();
          if(itm.konten.substring(6,9)=="RON"){
            this.storage.get('prof').then(profile => {
              this.param['params']['usr'] = profile.nik;
              this.param['params']['act'] ='cari';
              this.param['params']['mod'] ='list_ron';
              this.param['params']['ron'] = itm.konten.substring(6,21);
             
              this.api.getApi(this.param).then(datas => 
              {
                  if(datas['STATUS'] =="SUKSES") {
                    this.navCtrl.push(FormwoPage, {
                      item: datas['data'][0],
                    });
                  }else{
                      this.api.showAlert(datas['error']['text']);
                  }
              });
            });
          }else if(itm.konten.substring(6,9)=="REN"){
            this.navCtrl.push('MypartPage');
          }else if(itm.konten.substring(6,9)=="RET"){
            this.navCtrl.push('ListreturPage');
          }
        
        }else{
          this.api.showAlert(data['error']['error']);
        }
    });
  }
  readall(){
    if(confirm("Semua notifikasi akan diubah ke telah dibaca, yakin ??")){
      this.storage.get('prof').then(profile => {
        this.arr_token = this.api.random();
        this.param = {
            params: {
            mod: 'notifikasi',
            act: 'baca_semua',
            usr: profile.nik,
            rand: this.arr_token.rand,
            sessid: this.arr_token.sessid,
            token: this.arr_token.token
            }
        };
        this.api.getApi(this.param).then(data => 
        {
            if(data['STATUS'] =="SUKSES") {
              this.events.publish('notifikasi:created',Date.now());
              this.presentLoading();
            }else{
              this.api.showAlert(data['error']['error']);
            }
        });
      });
    }
  }
}
