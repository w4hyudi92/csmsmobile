import { Component } from '@angular/core';
import { App, IonicPage, ModalController, NavController, NavParams, ActionSheetController, LoadingController, Events, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { MetodepayksPage } from '../metodepayks/metodepayks';
import { MenuksPage } from '../menuks/menuks';
import { ChangeDetectorRef } from '@angular/core';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { MetodepayksPage } from '../metodepayks/metodepayks';
/**
 * Generated class for the FormksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formksadd',
  templateUrl: 'formksadd.html',
  providers: [ApiProvider]
})
export class FormksaddPage {
    nomorkks: string;
    konsumen_card: string;
    alamat_id: string;
    produk_id: string;
    jeniskks: string;
    produk_serial: string;
    service_center_id: string;
    tanggalbeli: string;
    itemJnsKKs: string;
    subtotal: number;
    biaya: string;
    produk: string;
    status: string;
    
    public param:any;
    public item:any;
    private itemMasterKs:any;
    private produkItem:any;
    private harga:any;
    private tanggal_pembelian:any;
    public arr_token: any;
    show: boolean = false;
    public datanya;
    arr_draft:any = [];
    private aktif:any;
    private isDisabled: boolean=true;

    arrData:any = [];

    myRand: string;
    tanggalFrom: string;
    tanggalTo: string;

    photo1: any =  './assets/images/img-not-found.jpg';
    photo2: any =  './assets/images/img-not-found.jpg';

    public base64Image : any;
    
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    public api: ApiProvider,
    public modalCtrl: ModalController, 
    public actionSheetCtrl: ActionSheetController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public atrCtrl: AlertController,
    public app: App,
    private cdRef:ChangeDetectorRef,
    private camera: Camera,
    private photoViewer: PhotoViewer,
    ) {
      this.datanya = navParams.get("item");
      console.log(this.datanya);
      this.item = navParams.get("item");
    }

  ionViewDidLoad() {
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'list_ks',
        act: 'masterks',
        aks: 'dropdown', // untuk dropdown jenis kks
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => {
        if(data['STATUS'] =="SUKSES") {
          this.itemMasterKs = data['data'];
        }else{
          this.api.showAlert(data['MESSAGE']);
        }
    });
    this.getProduk();
  }

  ngAfterViewChecked(){
    this.cdRef.detectChanges();
  }

  getProduk(){
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'list_ks',
        act: 'produk_konsumen',
        konid: this.datanya['konsumen_id'],
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => {
        if(data['STATUS'] =="SUKSES") {
          this.produkItem = data['data'];
        }else{
          this.api.showAlert(data['MESSAGE']);
        }
    });
  }

  pilihitem(){
    let modal = this.modalCtrl.create('ModelinfoprtsPage',
    {
        content: this,
        //limit: this.arr_limit["kredit_limit"] - this.arr_limit["rentalPrice"]
    });
    modal.present();
  }

  hapuspart(id){
    for(var k = 0; k < this.arrData.length; k++){
      if(this.arrData[k]['itemno'] == id){
          this.arrData.splice(k, 1);
          if(this.arrData.length==0){
            this.show = false;
          }
      }
    }    
  }

  getDuit(){
    this.presentLoading();
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'list_ks',
        act: 'masterks',
        aks: 'getduit',
        idks: this.jeniskks,
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => {
        if(data['STATUS'] =="SUKSES") {
          this.harga = data['data'];
          let date = moment().format("YYYYMMDD");
          let tglrand = date + this.random();
          let newval = '';
          let val = tglrand.replace(/\s/g, '');
          for(var i=0; i < val.length; i++) {
            if(i%4 == 0 && i > 0) newval = newval.concat(' ');
            newval = newval.concat(val[i]);
          }
          this.tanggalFrom = moment().format("YYYY-MM-DD");
          if(this.jeniskks == 'A6BDDC7F-F768-4FD3-9234-652A5860B0A6'){ // GOLD
            this.tanggalTo = moment().add(1, 'years').calendar();
            this.myRand = 'GOLD '+newval; //tglrand.toString();
          } else if(this.jeniskks == '53D54A4B-8C06-4C77-B1C3-ABE6AA4A5DAD'){ // SILVER
            this.tanggalTo = moment().add(1, 'years').calendar();
            this.myRand = 'SLVR '+newval; //tglrand.toString();
          }else if(this.jeniskks == 'D8ACF589-A5DA-407E-9B07-D9F2BEB0A95A'){ // Platinum
            this.tanggalTo = moment().add(2, 'years').calendar();
            this.myRand = 'PLAT '+newval; //tglrand.toString();
          }
        }else{
          this.api.showAlert(data['MESSAGE']);
        }
    });
  }

  random(): number {
    let rand = Math.floor(Math.random()*1E4);
    return rand;       
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
      this.events.publish('ftulist:created',Date.now());
      refresher.complete();
    }, 2000);
  }

  ubahserial(){
    this.isDisabled = false;
  }

  setData(){
    this.arr_draft['konsumen_card'] = this.datanya['konsumen_card'];
    this.arr_draft['nama_konsumen'] = this.datanya['nama_konsumen'];
    this.arr_draft['produk_id'] = this.produk;
    this.arr_draft['no_ks'] = this.nomorkks;
    this.arr_draft['garansi'] = this.tanggal_pembelian[0]['LeadTime'];
    this.arr_draft['harga'] = this.harga[0]['harga'];
    this.arr_draft['konsumen_id'] = this.datanya['konsumen_id'];
    this.arr_draft['alamat_id'] = this.datanya['alamat_id'];
    this.arr_draft['produk_serial'] = this.produk_serial;
    this.arr_draft['tglbeli'] = this.tanggal_pembelian[0]['tglbeli'];
    this.arr_draft['scid'] = this.tanggal_pembelian[0]['service_center_id'];
    this.arr_draft['idks'] = this.jeniskks;
  }

  presentActionSheet(photos) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih Foto',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon:'camera',
          handler: () => {
            // if(this.status !='Pending' && this.status !='Terima'){
            //     this.api.showAlert('Ron tidak bisa diubah lagi..');
            //     return false;            
            // }
            this.takePhoto(photos,1);
          }
        },{
          text: 'Galeri Foto',
          icon:'images',
          handler: () => {
            // if(this.status !='Pending' && this.status !='Terima'){
            //     this.api.showAlert('Ron tidak bisa diubah lagi..');
            //     return false;            
            // }
            this.takePhoto(photos,0);
          }
        },{
            text: 'Preview',
            icon:'eye',
            handler: () => {
            this.viewPhoto(photos);
            }
        },{
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  viewPhoto(photos){
    if(photos==1) {
        this.photoViewer.show(this.photo1);
    }else if(photos==2){
        this.photoViewer.show(this.photo2);
    }
  }

  takePhoto(photos,sourceType:number){
    let options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: sourceType,
      correctOrientation: true
    }
    if(this.nomorkks == ""){
      alert("Nomor KKS Harus diisi");
    }else{
      this.camera.getPicture(options).then((imageData) => {
          this.base64Image = "data:image/jpeg;base64," + imageData;
          if(photos==1) {
              this.photo1 = this.base64Image;
              this.api.pushImage(this.nomorkks + '-kks.jpg', this.base64Image, 'kks');
          }else if(photos==2){
              this.photo2 = this.base64Image;
              this.api.pushImage(this.nomorkks + '-produk.jpg', this.base64Image, 'kks');
          }
          photos.reverse();
          
          
      }, (err) => {
        this.api.showAlert(err);
        console.log(err);
      });
    }
  }

  prosesks(){
    this.presentLoading();
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'list_ks',
        act: 'cekdaftarks',
        konsumen_id: this.datanya['konsumen_id'],
        produk_id: this.datanya['produk_id'],
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.api.getApi(this.param).then(data => {
      if(data['STATUS'] =="SUKSES") {
        this.aktif = data['data'];
        if(this.aktif[0]['aktif'] == 1){
          const alert = this.atrCtrl.create({
            title: 'Pemberitahuan',
            subTitle: 'Konsumen & Produk Ini sudah terdaftar.',
            buttons: [{
              text: 'Oke',
              handler: () => {
                this.app.getRootNav().push(MenuksPage);
              }
            }]
          });
          alert.present();
        }else{
          this.setData();
          this.navCtrl.push('MetodepayksPage',{
            isi: this.arr_draft,
            pending: false
          });
        }
      }else{
        this.api.showAlert(data['MESSAGE']);
      }
    });
  }


}
