import { Component } from '@angular/core';
import { LoadingController,IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { DetailrentalPage } from './../detailrental/detailrental';


@IonicPage()
@Component({
  selector: 'page-schedule',
  templateUrl: 'schedule.html',
})
export class SchedulePage {
  public dari_tgl :any;
  public dari_tgl_f :any;
  public param:any;
  public arr_token: any;
  arrList=[];
  show: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage,
    public loadingCtrl: LoadingController,
  ) {
        this.presentLoading();
        //this.isi = navParams.get("isi");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDraft');
    this.dari_tgl = moment().format("DD/MM/YYYY");
    this.dari_tgl_f = moment().format("DD/MM/YYYY");  
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.getData()
      refresher.complete();
    }, 2000);
  }
  getData() {
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'jadwal',
          act: 'tampil_jadwal',
          usr: profile.nik,
          tanggal: this.dari_tgl,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        console.log(data);
        
        if(data['STATUS'] =="SUKSES") {
          if(data['data'] == undefined) {
            this.arrList = [];
            this.show= false;
          }else{
            this.arrList = data['data'];
            this.show= true;
          }
        }else{
            this.api.showAlert(data['MESSAGE']);
            this.arrList = [];
            this.show= false;
        }
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
  
  onChangeTanggal(event) {
    this.dari_tgl_f = event.day + '/' + event.month + '/' + event.year;
    this.presentLoading();
   
  }
}
