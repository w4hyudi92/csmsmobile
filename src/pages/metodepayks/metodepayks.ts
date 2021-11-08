import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, Events, ViewController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { MenuksPage } from '../menuks/menuks';
import { SuccessksPage } from '../successks/successks';


@IonicPage()
@Component({
  selector: 'page-metodepayks',
  templateUrl: 'metodepayks.html',
  providers: [ApiProvider]
})
export class MetodepayksPage {
  public par;
  status:string;
  private param:any;
  private arr_token: any;
  biaya: string;
  hasil: number;
  diskon: string;
  metodepayment: string;
  subtotal: number;
  private isi: any;
  myDate: any;
  arrData: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage, 
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public atrCtrl: AlertController) {
      this.isi = navParams.get("isi");
      console.log(this.isi);
      this.myDate = new Date();
    }
  
  ionViewDidLoad() {
    //this.storage.remove('waktu_kunjungan');
    this.presentLoading();
  }

  ionViewDidEnter() {
    this.presentLoading();
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    loader.dismiss();
  }

  doRefresh(refresher) {
    
    setTimeout(() => {
      this.events.publish('metodepayks:created',Date.now());
      refresher.complete();
    }, 2000);
  }
  

  setDataArray(){
    this.arrData['konsumen_card'] = this.isi['konsumen_card'];
    this.arrData['nama_konsumen'] = this.isi['nama_konsumen'];
    this.arrData['produk_id'] = this.isi['produk_id'];
    this.arrData['no_ks'] = this.isi['no_ks'];
    this.arrData['tglakhir'] = this.isi['tglakhir'];
    this.arrData['garansi'] = this.isi['LeadTime'];
    this.arrData['harga'] = this.isi['harga'];
    this.arrData['konsumen_id'] = this.isi['konsumen_id'];
    this.arrData['alamat_id'] = this.isi['alamat_id'];
    this.arrData['produk_id'] = this.isi['produk_id'];
    this.arrData['produk_serial'] = this.isi['produk_serial'];
    this.arrData['tglbeli'] = this.isi['tglbeli'];
    this.arrData['scid'] = this.isi['service_center_id'];
    this.arrData['idks'] = this.isi['idks'];
    this.arrData['jnsks'] = this.isi['jeniskks'];
    this.arrData['diskon'] = this.diskon;
  }

  getTotal(disc){
    if(disc == 'other'){
      const confirm = this.atrCtrl.create({
        title: 'Tentukan Diskon',
        inputs: [
          {
            name: 'diskon',
            type: 'text'
          }], 
        buttons: [
        {
            text: 'Oke',
            handler: (alertData) => {
              this.diskon = alertData.diskon;
              this.hasil = parseInt(this.isi['harga'])-(parseInt(this.isi['harga'])*alertData.diskon/100);
            }
        }
        ]
      });
      confirm.present();
    }else{
      this.hasil = parseInt(this.isi['harga'])-(parseInt(this.isi['harga'])*disc/100);
    }
  }
  

  bayarks(){
    console.log(this.diskon);
    console.log(this.metodepayment);
    if(this.diskon == 'undefined'){
      const alert = this.atrCtrl.create({
        title: 'Periksa',
        subTitle: 'Diskon Belum dipilih!',
        buttons: ['Oke']
      });
      alert.present();
    }else if(this.metodepayment == "undefined"){
      const alert = this.atrCtrl.create({
        title: 'Periksa',
        subTitle: 'Metode Pembayaran Belum dipilih!',
        buttons: ['Oke']
      });
      alert.present();
    }else{
      this.setDataArray();
      this.storage.get('login').then(usr => {
        this.arr_token = this.api.random();

        this.storage.get('prof').then(profile => {
          // this.arr_token = this.api.random();
          this.param = {
              params: {
              mod: 'list_ks',
              act: 'bayarks',
              usr: profile.nik,
              idks: this.isi['idks'],
              konsumen_id: this.isi['konsumen_id'],
              alamat_id: this.isi['alamat_id'],
              produk_id: this.isi['produk_id'],
              produk_serial: this.isi['produk_serial'],
              tglbeli: this.isi['tglbeli'],
              tglawal: this.isi['tglawal'],
              tglakhir: this.isi['tglakhir'],
              scid: this.isi['scid'],
              no_ks: this.isi['no_ks'],
              metodepayment: this.metodepayment,
              diskon: this.diskon,
              harga: this.isi.harga,
              total: this.hasil,
              rand: this.arr_token.rand,
              sessid: this.arr_token.sessid,
              token: this.arr_token.token
              }
          }
        });
        this.api.getApi(this.param).then(data => 
        {
          if(data['STATUS'] =="SUKSES") {
            const alert = this.atrCtrl.create({
              title: 'Berhasil',
              subTitle: 'KS Berhasil diproses.',
              buttons: [{
                text: 'Oke',
                handler: () => {
                  this.navCtrl.push(SuccessksPage,{
                    isi: this.arrData,
                    pending: false
                  });
                }
              }]
            });
            alert.present();
          }/*else{
            loader.dismiss();
            const alert = this.atrCtrl.create({
              title: 'Server tidak merespon!',
              subTitle: 'Server tidak merespon',
              buttons: ['Oke']
            });
            alert.present();
          }*/
        });
      });
    }
  }


}
