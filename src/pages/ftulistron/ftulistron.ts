import { Component } from '@angular/core';
import { App, LoadingController, IonicPage, NavController, NavParams,Events, ModalController, AlertController } from 'ionic-angular';
import { FormftuPage } from './../formftu/formftu';
import { FirebasePage } from './../firebase/firebase';
import { StoryservicePage } from './../storyservice/storyservice';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import * as moment from 'moment';
import { FormksPage } from '../formks/formks';
/**
 * Generated class for the ListwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-ftulistron',
  templateUrl: 'ftulistron.html',
  providers: [ApiProvider]
})
export class FtulistronPage {
  public param:any;
  public arr_token: any;
  arrList=[];
  isfiltered: boolean= false ;
  hariini: string;
  tanggal: string;

  private aktif: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public events: Events,
    public api: ApiProvider,
    private callNumber: CallNumber,
    public modalCtrl: ModalController,
    private storage: Storage,
    private app: App,
    public atrCtrl: AlertController) {
      this.storage.get('arr_wo').then(arr_wo => {
        if(arr_wo == null ){
          this.isfiltered=true;
        }else{
          this.arrList = arr_wo;
        }
        
      });

      this.hariini = moment().format("DD/MM/YYYY");  
      this.tanggal = moment().format("DD/MM/YYYY");

      this.api.initializeNetworkEvents();
      events.subscribe('refreshron:created', eventData => { 
        this.getData();
      });

  }

  ionViewDidEnter() {
    this.presentLoading();
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.getData()
      refresher.complete();
    }, 2000);
  }

  call(nomor){
    if(confirm("Anda yakin akan melakukan panggilan telepon ?")){
      this.callNumber.callNumber(nomor, false)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.log('Error launching dialer', err));
    }
    
  }

  sinkronisasi(){
    this.getData();
  }

  getData() {
    this.presentLoading();
    this.arrList = [];
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'ftulist',
          act:'listronftu',
          //tanggal: this.tanggal,
          usr: profile.nik,
          sc: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        
          if(data['STATUS'] =="SUKSES") {
            var dateGroup = [];
            this.isfiltered=true;
            console.log('datanya : '+data['data']);
            for (let value of data['data']) {
              
                this.storage.get('draft_ron').then(draft => {
                  //console.log(draft);
                  if(draft != undefined){
                    for(var k = 0; k < draft.length; k++){
                      if(draft[k]['log_id'] == value.log_id){
                        value.draft = true;
                      }
                    }
                  }
                });

                let date = value.jadwal_tanggal;
                if (dateGroup[date]) {
                    dateGroup[date].push(value);
                } else {
                    dateGroup[date] = [];
                    dateGroup[date].push(value);
                }
                this.isfiltered=false;
            }
           
            for(var key in dateGroup) {
                filtered.push({
                    tanggal: key,
                    item: dateGroup[key]
                });
            }
            this.arrList = filtered;
            this.api.setmemory('arr_wo',this.arrList );
          }else{
              this.api.showAlert(data['MESSAGE']);
          }
      });
    });
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    loader.dismiss();
  }

  select(item) {
    this.presentLoading();
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'ftulist',
        act: 'cekdaftarftu',
        ron: item['nomor_ron'],
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => {
      if(data['STATUS'] =="SUKSES") {
        this.aktif = data['data'];
        if(this.aktif[0]['cekftu'] == 1){
          const alert = this.atrCtrl.create({
            title: 'Pemberitahuan',
            subTitle: 'Konsumen & Produk Ini sudah terdaftar.',
            buttons: [{
              text: 'Oke',
              handler: () => {
                //this.app.getRootNav().push(FtulistronPage);
              }
            }]
          });
          alert.present();
        }else{
          this.navCtrl.push(FormftuPage, {
            item: item,
          })
        }
      }else{
        this.api.showAlert(data['MESSAGE']);
      }
    });
  }
}
