import { Component } from '@angular/core';
import { Platform, IonicPage, NavController, NavParams, LoadingController, Events, ViewController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Storage } from '@ionic/storage';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { FileOpener } from '@ionic-native/file-opener';
import * as moment from 'moment';


@IonicPage()
@Component({
  selector: 'page-historydetailftu',
  templateUrl: 'historydetailftu.html',
  providers: [ApiProvider]
})
export class HistorydetailftuPage {
  public par;
  status:string;
  private param:any;
  private arr_token: any;
  biaya: string;
  hasil: number;
  diskon: number;
  subtotal: number;
  private isi: any;
  myDate: any;
  arrData: any = [];
  public tglcetak: any;
  pdfObj = null;

  diskonrp: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private file: File, 
    private filePath: FilePath,
    private fileOpener: FileOpener,
    private plt: Platform,
    public api: ApiProvider,
    private storage: Storage, 
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public events: Events,
    public atrCtrl: AlertController) {
      this.isi = navParams.get("isi");
      console.log(this.isi);
      this.myDate = new Date();
      this.tglcetak =  moment().format("DD-MM-YYYY");
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
    this.arrData['diskon'] = this.isi['diskon'];
  }

}
