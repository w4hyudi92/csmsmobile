import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the FormschPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formsch',
  templateUrl: 'formsch.html',
  providers: [ApiProvider]
})
export class FormschPage {
  public alasan: string;
  private param:any;
  private arr_token: any;
  private itemAlasan:any;
  tanggal: string;
  jam: string;
  id_waktu: string = "";
  arrData:any = [];
   ron: string;
  perbaikan_id: string;
  keterangan: string;
  alamat: string;
  nama_konsumen: string;
  konsumen_id: string;

  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage,) {
      this.tanggal = moment().format("DD/MM/YYYY");
      this.ron = navParams.get("ron");
      this.alamat = navParams.get("alamat");
      this.nama_konsumen = navParams.get("nama_konsumen");
      this.perbaikan_id = navParams.get("perbaikan_id");
      this.konsumen_id = navParams.get("konsumen_id");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormschPage');
    this.alasan = '0';

    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'repair',
        act: 'tipe_service',
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.storage.get('prof').then(profile => {
      this.param['params']['act'] = 'alasan_tertunda';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemAlasan = data['data'];
          }else{
            this.api.showAlert(data['error']['error']);
          }
      });
    });
  }

  pilih(characterNum){
    let modal = this.modalCtrl.create('ModalschPage',{
      content : this
    });
    modal.present();
  }
  submit(){
    if(this.alasan=="0"){
      alert('Alasan harus dilengkapi..!');
      return;
    }
    if(this.keterangan==""){
      alert('Keterangan harus diisi..!');
      return;
    }
    if(this.id_waktu==""){
      alert('Waktu harus diisi..!');
      return;
    }

    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'jadwal',
        act: 'update_jadwal',
        ron: this.ron,
        tanggal: this.tanggal,
        perbaikan_id: this.perbaikan_id,
        id_waktu: this.id_waktu,
        alasan: this.alasan,
        keterangan: this.keterangan,
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token,
        konsumen_id: this.konsumen_id
        }
    };
    console.log(this.param);
    this.storage.get('prof').then(profile => {
      this.param['params']['usr'] = profile.nik;
      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          alert('Sukses');
          //this.navCtrl.pop();
        }else{
            this.api.showAlert(data['error']['error']);
        }
      });
    });
  }
}
