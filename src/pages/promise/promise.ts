import { Component } from '@angular/core';
import { ModalController, LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-promise',
  templateUrl: 'promise.html',
  providers: [ApiProvider]
})
export class PromisePage {

  public param:any;
  public arr_token: any;
  arrList=[];
  isfiltered: boolean ;
  hariini: string;
  tanggal: string;
 
  show: boolean = false;

  constructor( public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
      
      this.presentLoading();
      this.hariini = moment().format("DD/MM/YYYY");  
      this.tanggal = moment().format("DD/MM/YYYY");
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.getData()
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PromisePage');
  }

  select(itm) {
    this.navCtrl.push('FormschPage',{
      ron: itm["nomor_ron"],
      perbaikan_id: itm["perbaikan_id"],
      alamat: itm["alamat"],
      nama_konsumen: itm["nama_konsumen"],
      konsumen_id: itm["konsumen_id"]
    });
  }

  getData() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    
    this.storage.get('prof').then(profile => {
      loader.present();
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
      this.storage.get('prof').then(profile => {
        this.api.getApi(this.param).then(data => 
        {
          
            if(data['STATUS'] =="SUKSES") {
              if(data['data'] == undefined) {
                this.arrList = [];
                this.show= false;
              }else{
                var dateGroup = [];
                for (let value of data['data']) {
                    this.storage.get('draft_ron').then(draft => {
                      console.log(draft);
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
                }
              
                for(var key in dateGroup) {
                    filtered.push({
                        tanggal: key,
                        item: dateGroup[key]
                    });
                }
                this.arrList = filtered;
                this.show= true;
              }
              loader.dismiss();
            }else{
              loader.dismiss();
                this.api.showAlert(data['error']['error']);
            }
        });
      });
    });
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.getData();
    loader.dismiss();
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

}
