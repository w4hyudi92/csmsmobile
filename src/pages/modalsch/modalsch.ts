import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import * as moment from 'moment';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ModalschPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalsch',
  templateUrl: 'modalsch.html',
})
export class ModalschPage {
  public dari_tgl :any;
  public dari_tgl_f :any;
  public param:any;
  public arr_token: any;
  arrList=[];
  show: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public api: ApiProvider,
    private storage: Storage,
    public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalschPage');
    this.dari_tgl = moment().format("DD/MM/YYYY");
    this.dari_tgl_f = moment().format("DD/MM/YYYY");  
    this.presentLoading();
  }

  getData() {
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'jadwal',
          act: 'tampil_jadwal',
          usr: profile.nik,
          tanggal: this.dari_tgl_f,
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
    this.dari_tgl_f = (event.day<10 ? '0'+event.day : event.day) + '/' + (event.month<10 ? '0'+event.month : event.month) + '/' + event.year;
    this.presentLoading();
   
  }

  pilih(jam) {
    if(jam.kapa==0){
      alert('Slot sudah habis/kosong, silahkan hubungi administrator.');
      return;
    }
    console.log(jam);
    this.navParams.get('content').tanggal = this.dari_tgl_f;
    this.navParams.get('content').jam = jam['jam'];
    this.navParams.get('content').id_waktu = jam['id_waktu'];
    this.viewCtrl.dismiss();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
