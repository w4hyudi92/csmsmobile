import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams, ActionSheetController, LoadingController, Events, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { MetodepayksPage } from '../metodepayks/metodepayks';
import { ListksPage } from '../listks/listks';
import { MenuksPage } from '../menuks/menuks';
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
  selector: 'page-formks',
  templateUrl: 'formks.html',
  providers: [ApiProvider]
})
export class FormksPage {
    public base64Image : any;
    nomorkks: string;
    status: string;
    konsumen_card: string;
    alamat_id: string;
    tanggalFrom: string;
    tanggalTo: string;
    produk_id: string;
    jeniskks: string;
    produk_serial: string;
    service_center_id: string;
    garansi: string;
    tanggalbeli: string;
    itemJnsKKs: string;
    subtotal: number;
    biaya: string;
    produk: string;

    photo1: any =  './assets/images/img-not-found.jpg';
    photo2: any =  './assets/images/img-not-found.jpg';
    photo3: any =  './assets/images/img-not-found.jpg';
    photo4: any =  './assets/images/img-not-found.jpg';
    
    public param:any;
    public item:any;
    private itemMasterKs:any;
    private produkItem:any;
    private aktif:any;
    private harga:any;
    public arr_token: any;
    show: boolean = false;
    public datanya;
    arr_draft:any = [];
    private isDisabled: boolean=true;
    
  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    public api: ApiProvider,
    public actionSheetCtrl: ActionSheetController,
    public events: Events,
    public loadingCtrl: LoadingController,
    public atrCtrl: AlertController,
    private app: App,
    private camera: Camera,
    private photoViewer: PhotoViewer,
    ) {
      this.datanya = navParams.get("item");
      console.log(this.datanya);
      this.item = navParams.get("item");
      
      let tanggal = this.datanya['tglbeli'].toString().substring(8,10);
      let bulan = this.datanya['tglbeli'].toString().substring(5,7);
      let tahun = parseInt(this.datanya['tglbeli'].toString().substring(0,4))+2;
      if(this.datanya['LeadTime'] == 'IN - GUARANTEE'){
        this.presentLoading();
        //debugger;
        this.tanggalFrom = '';
        //this.tanggalFrom = tahun + '/' + bulan + '/' + tanggal;
        this.tanggalTo = tahun.toString() + '/' + bulan.toString() + '/' + tanggal.toString();
      }else if(this.datanya['LeadTime'] == 'OUT - GUARANTEE'){
        this.presentLoading();
        this.tanggalFrom = '';
        this.tanggalTo = '';
      }
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

  ubahserial(){
    this.isDisabled = false;
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
        }else{
          this.api.showAlert(data['MESSAGE']);
        }
    });
  }

  onChangeTanggal(event) {
    let tahun = parseInt(event.year)+1;
    this.tanggalFrom = tahun + '/' + (event.month<10 ? '0'+event.month : event.month) + '/' + (event.day<10 ? '0'+event.day : event.day);
    this.tanggalTo = tahun + '/' + (event.month<10 ? '0'+event.month : event.month) + '/' + (event.day<10 ? '0'+event.day : event.day);   
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

  setData(){
    this.arr_draft['konsumen_card'] = this.datanya['konsumen_card'];
    this.arr_draft['nama_konsumen'] = this.datanya['nama_konsumen'];
    this.arr_draft['produk_id'] = this.produk;
    this.arr_draft['no_ks'] = this.nomorkks;
    this.arr_draft['tglakhir'] = this.tanggalTo;
    this.arr_draft['garansi'] = this.datanya['LeadTime'];
    this.arr_draft['harga'] = this.harga[0]['harga'];
    this.arr_draft['jeniskks'] = this.harga[0]['meta_value_deskripsi'];
    this.arr_draft['konsumen_id'] = this.datanya['konsumen_id'];
    this.arr_draft['alamat_id'] = this.datanya['alamat_id'];
    this.arr_draft['produk_id'] = this.datanya['produk_id'];
    this.arr_draft['produk_serial'] = this.produk_serial;//this.datanya['produk_serial'];
    this.arr_draft['tglbeli'] = this.datanya['tglbeli'];
    this.arr_draft['scid'] = this.datanya['service_center_id'];
    this.arr_draft['idks'] = this.jeniskks;
    if(this.datanya['LeadTime'] == 'IN - GUARANTEE'){
      this.arr_draft['tglawal'] = this.datanya['tglbeli'];
    }else{
      this.arr_draft['tglawal'] = this.tanggalFrom;
    }
    //this.arr_draft['all'] = this.datanya;
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
            if(this.status !='Pending' && this.status !='Terima'){
                this.api.showAlert('Ron tidak bisa diubah lagi..');
                return false;            
            }
            this.takePhoto(photos,1);
          }
        },{
          text: 'Galeri Foto',
          icon:'images',
          handler: () => {
            if(this.status !='Pending' && this.status !='Terima'){
                this.api.showAlert('Ron tidak bisa diubah lagi..');
                return false;            
            }
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
    }else if(photos==3){
      this.photoViewer.show(this.photo3);
    }else if(photos==4){
      this.photoViewer.show(this.photo4);
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
    this.camera.getPicture(options).then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        if(photos==1) {
            this.photo1 = this.base64Image;
            // this.api.pushImage(this.ron + '-part1.jpg', this.base64Image, 'part');
        }else if(photos==2){
            this.photo2 = this.base64Image;
            // this.api.pushImage(this.ron + '-part2.jpg', this.base64Image, 'part');
        }else if(photos==3){
          this.photo3 = this.base64Image;
          // this.api.pushImage(this.ron + '-garansi1.jpg', this.base64Image, 'garansi');
        }else if(photos==4){
          this.photo4 = this.base64Image;
          // this.api.pushImage(this.ron + '-garansi2.jpg', this.base64Image, 'garansi');
        }
        photos.reverse();
        
        
    }, (err) => {
      this.api.showAlert(err);
       console.log(err);
    });
  }

  cekks(){
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
            this.presentLoading();
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
