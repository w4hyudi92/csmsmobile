import { Component } from '@angular/core';
import { LoadingController, ViewController, ModalController, IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { identifierModuleUrl } from '@angular/compiler';
import { ListwoprtsPage } from '../listwoprts/listwoprts';
import { ListkonsumenprtsPage } from '../listkonsumenprts/listkonsumenprts';
import { SuccessprtsPage } from '../successprts/successprts';
import * as moment from 'moment';
/**
 * Generated class for the MenupartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jualpart',
  templateUrl: 'jualpartcheckout.html',
})
export class JualPartCheckoutPage {
  private param:any;
  private isi:any;
  private arr_token: any;
  public params;
  private itemKategori:any;
  arr_limit=[];
  datanya:any = [];
  show: boolean = false;
  total: number = 0;
  arr_draft:any = [];
  arrDataJual:any = [];
  
  keterangan: string;
  ronno:string;
  perbaikan_id:string;
  konsumen: string;
  namakonsumen: string;
  telepon: string;
  konsumenid: string;
  metodepembayaran: string;
  catatan: string;
  kategori:string;  

  diskon: string;

  constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public atrCtrl: AlertController
  ) {
    this.datanya = navParams.get("item");
  }

  ionViewDidLoad() {
    this.hitungtotal();
    this.kategoriselect();
  }

  // getTotal(disc){
  //   if(disc == 'sd'){
  //     const confirm = this.atrCtrl.create({
  //       title: 'Tentukan Diskon',
  //       inputs: [
  //         {
  //           name: 'diskon',
  //           type: 'text'
  //         }], 
  //       buttons: [
  //       {
  //           text: 'Oke',
  //           handler: (alertData) => {
  //             this.diskon = alertData.diskon;
  //             this.total = parseInt(this.isi['harga'])-(parseInt(this.isi['harga'])*alertData.diskon/100);
  //           }
  //       }
  //       ]
  //     });
  //     confirm.present();
  //   }else{
  //     this.total = parseInt(this.isi['harga'])-(parseInt(this.isi['harga'])*disc/100);
  //   }
  // }

  kategoriselect(){
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'part',
          act: 'kategori_part',
          svc_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };

      this.api.getApi(this.param).then(data => 
        {
          console.log(data);
            if(data['STATUS'] =="SUKSES") {
              this.itemKategori = data['data'];
            }else{
              this.api.showAlert(data['MESSAGE']);
            }
        });
    });
  }

  pilihkonsumen(konsumen){
    if(konsumen == "byron"){
      let modal = this.modalCtrl.create(ListwoprtsPage, { content: this, });
      modal.onDidDismiss(() => {
        console.log(this.konsumenid);
      });
      modal.present();
    }else if(konsumen == "notron"){
      let modal = this.modalCtrl.create(ListkonsumenprtsPage, { content: this, });
      modal.onDidDismiss(() => {
        console.log(this.konsumenid);
      });
      modal.present();
    }else if(konsumen == "baru"){
      this.konsumenid = '0';
      this.namakonsumen = '';
      this.telepon = '';
    }
  }

  setFilteredItems(namakonsumen) {
    this.namakonsumen = namakonsumen.toUpperCase();
  }

  pilihitem(){
    let modal = this.modalCtrl.create('ModelinfoprtsPage',
      {
        content: this,
        //limit: this.arr_limit["kredit_limit"] - this.arr_limit["rentalPrice"]
      });
    modal.present();
  }

  hitungtotal(){
    let tot:number = 0
    for(var k = 0; k < this.datanya.length; k++){
      tot = tot + ( this.datanya[k]['unitprice_disc'] * this.datanya[k]['qty'])
    }
    this.total = tot;
  }

  bayardong(){
    if(this.namakonsumen == ''){
      alert("Nama Konsumen Harus diisi!");
    }else if(this.telepon == ''){
      alert("No. Handphone Harus diisi!");
    }else if(this.metodepembayaran == "0"){
      console.log(this.metodepembayaran);
      alert("Pilih Metode Pembayaran!");
    }else if(this.konsumen == "0"){
      console.log(this.konsumen);
      alert("Pilih Sumber Konsumen!");
    }else{
      let arr_part = [];
      for(var k = 0; k < this.datanya.length; k++){
        arr_part.push({
          item_desc: this.datanya[k]['item_desc'],
          itemno: this.datanya[k]['itemno'],
          qty: this.datanya[k]['qty'],
          qty_avail: parseInt(this.datanya[k]['qty_avail']),
          unitprice_disc: this.datanya[k]['unitprice_disc'],
          diskon: this.datanya[k]['diskon'],
          disc_currency: this.datanya[k]['disc_currency'],
          unitprice: this.datanya[k]['unitprice'],
          inventory_id: this.datanya[k]['inventory_id'],
        });
      }

      let date = moment().format("YYYYMMDD");
      let tglrand = date + this.random();

      this.arr_token = this.api.random();
      this.param = {
          params: {
            mod: 'part',
            act: 'insertpartsales',
            note: this.catatan,
            nojual: 'PRTS-'+tglrand,
            konsumenid: this.konsumenid,
            namakonsumen: this.namakonsumen,
            telepon: this.telepon,
            kategori: this.kategori,
            metodepay: this.metodepembayaran,
            part: JSON.stringify(arr_part),
            total: this.total,
            rand: this.arr_token.rand,
            sessid: this.arr_token.sessid,
            token: this.arr_token.token,
          }
      };
      console.log('test param: '+JSON.stringify(arr_part));
      this.storage.get('prof').then(profile => {
        this.param['params']['usr'] = profile.nik;
        this.param['params']['service_center_id'] = profile.service_center_id;
        this.api.getApi(this.param).then(data => 
        {
          if(data['STATUS'] =="SUKSES") {
            const alert = this.atrCtrl.create({
              title: 'Berhasil',
              subTitle: 'Penjualan Accs Berhasil.',
              buttons: [{
                text: 'Oke',
                handler: () => {
                  console.log("Data Lengkap : "+this.arrDataJual);
                  this.navCtrl.push(SuccessprtsPage,{
                    isi: this.param,
                    produk: arr_part,
                    pending: false
                  });
                }
              }]
            });
            alert.present();
          }else{
              this.api.showAlert(data['error']['error']);
          }
        });
      });
    }
  }

  random(): number {
    let rand = Math.floor(Math.random()*1E2);
    return rand;       
  }

}
