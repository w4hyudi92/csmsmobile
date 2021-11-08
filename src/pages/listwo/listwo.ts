import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams,Events, ModalController } from 'ionic-angular';
import { FormwoPage } from './../formwo/formwo';
import { FirebasePage } from './../firebase/firebase';
import { StoryservicePage } from './../storyservice/storyservice';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { CallNumber } from '@ionic-native/call-number';
import * as moment from 'moment';
/**
 * Generated class for the ListwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-listwo',
  templateUrl: 'listwo.html',
  providers: [ApiProvider]
})
export class ListwoPage {
  public param:any;
  public arr_token: any;
  arrList=[];
  isfiltered: boolean= false ;
  hariini: string;
  tanggal: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController,
    public events: Events,
    public api: ApiProvider,
    private callNumber: CallNumber,
    public modalCtrl: ModalController,
    private storage: Storage,) {
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

  getData() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server......",
    });
    loader.present();
    this.arrList = [];
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'list_ron',
          act:'filter',
          tanggal: this.tanggal,
          usr: profile.nik,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        console.log(data['status']);
          if(data['STATUS'] =="SUKSES") {
            var dateGroup = [];
            this.isfiltered=true;
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
            loader.dismiss();
          }else{
              this.api.showAlert(data['MESSAGE']);
              loader.dismiss();
          }
      });
    });
  }
  
  sinkronisasi(){
    this.getData();
  }
  select(item) {
      this.navCtrl.push(FormwoPage, {
        item: item,
      })
  }

  myHistory(){
    this.navCtrl.push(StoryservicePage);
  }
  openmap(alamat){
    this.navCtrl.push(FirebasePage,{
      alamat: alamat
    });
  }

  openview(){
    let modal = this.modalCtrl.create('ModalfilterPage',
      {
        content: this,
      });
    modal.onDidDismiss(() => {
      this.presentLoading()
      });
    modal.present();
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.getData();
    loader.dismiss();
  }
}
