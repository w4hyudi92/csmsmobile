import { Component } from '@angular/core';
import { App, Platform, IonicPage, NavController, NavParams, ActionSheetController, LoadingController, Events, ToastController, AlertController } from 'ionic-angular';
import * as moment from 'moment';
import { Storage } from '@ionic/storage';
import { ApiProvider } from '../../providers/api/api';
import { FileOpener } from '@ionic-native/file-opener';
import { File } from '@ionic-native/file';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { FtulistPage } from '../ftulist/ftulist';
/**
 * Generated class for the FormwoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formftu',
  templateUrl: 'formftu.html',
  providers: [ApiProvider]
})
export class FormftuPage {
    status: string;
    cabang: string;
    statusproduk: string;
    nogaransi: string;
    statusgaransi: string;
    keluhanbody: string;
    keluhanfungsi: string;
    penyebab: string;
    ket_tambahan: string;
    aksesoris: string;
    part: string;
    ftuno: string;
    formno: string;
    urut: string;
    public param:any;
    public item:any;
    public arr_token: any;
    arrList=[];
    arr_draft:any = [];
    show: boolean = false;
    public base64Image : any;
    public datanya;
    photo1: any =  './assets/images/img-not-found.jpg';
    photo2: any =  './assets/images/img-not-found.jpg';
    photo3: any =  './assets/images/img-not-found.jpg';
    photo4: any =  './assets/images/img-not-found.jpg';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    public api: ApiProvider,
    private fileOpener: FileOpener,
    private plt: Platform,
    private photoViewer: PhotoViewer,
    private camera: Camera,
    public actionSheetCtrl: ActionSheetController,
    private file: File, 
    public events: Events,
    public loadingCtrl: LoadingController,
    private app: App,
    public atrCtrl: AlertController
    ) {
      this.datanya = navParams.get("item");
      console.log(this.datanya);
      this.status = this.datanya['status'];
      this.item = navParams.get("item");
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
      this.events.publish('ftulist:created',Date.now());
      refresher.complete();
    }, 2000);
  }

  simpanFtu(){
    this.presentLoading();
    var sg = "";
    if(this.datanya['status_garansi'] == "IN"){
      sg = "204";
    }else if(this.datanya['status_garansi'] == "OUT"){
      sg = "205";
    }else if(this.datanya['status_garansi'] == "PB"){
      sg = "206";
    }else if(this.datanya['status_garansi'] == "GS"){
      sg = "203";
    }else if(this.datanya['status_garansi'] == "ST"){
      sg = "207";
    }else if(this.datanya['status_garansi'] == "TK"){
      sg = "208";
    }else if(this.datanya['status_garansi'] == "RU"){
      sg = "209";
    }

    let text = this.validate();
    if(text == ''){
      this.storage.get('prof').then(profile => {
        this.arr_token = this.api.random();
        this.param = {
            params: {
            mod: 'ftulist',
            act: 'simpanftu',
            token: this.arr_token.token,
            pid: this.datanya['perbaikan_id'],
            ron: this.datanya['nomor_ron'],
            itemdesc: this.datanya['itemdesc'],
            itemno: this.datanya['itemno'],
            serial: this.datanya['produk_serial'],
            tglbeli: this.datanya['tanggal_pembelian'],
            namakonsumen: this.datanya['nama_konsumen'],
            kid: this.datanya['konsumen_id'],
            alamat: this.datanya['alamat'],
            telepon: this.datanya['telepon'],
            statusgaransi: sg,
            cabang: this.datanya['service_center_id'],
            keluhanbody: this.keluhanbody,
            keluhanfungsi: this.keluhanfungsi,
            penyebab: this.penyebab,
            ket_tambahan: this.ket_tambahan,
            aksesoris: this.aksesoris,
            part: this.part,
            statusproduk: this.statusproduk,
            nogaransi: this.nogaransi,
            status: 'MP',
            usr: profile.nik,
            rand: this.arr_token.rand,
            sessid: this.arr_token.sessid
            }
        }
      });
      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          const alert = this.atrCtrl.create({
            title: 'Berhasil',
            subTitle: 'FTU berhasil tersimpan.',
            buttons: [{
              text: 'Oke',
              handler: () => {
                this.navCtrl.push(FtulistPage);
              }
            }]
          });
          alert.present();
        }
      });
    }else{
      this.api.showAlert(text);
    }
  }

  validate(){
    var text ='';
    // if(this.cabang == "0" ){
    //   text ='- Service center belum dipilih.<br>';
    // }
    if(this.statusproduk == "0" ){
      text ='- Status Produk belum dipilih.<br>';
    }
    // if(this.penyebabkejadian.trim()==''){
    //   text +='- Penyebab Kejadian harus diisi<br>';
    // }
    if(this.keluhanbody.trim()==''){
      text +='- Keluhan Body/Fisik harus diisi<br>';
    }
    if(this.keluhanfungsi.trim()==''){
      text +='- Keluhan Fungsi harus diisi<br>';
    }
    // if(this.nogaransi.trim()==''){
    //   text +='- No. Garansi harus diisi<br>';
    // }
    return text;
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
                this.api.showAlert('Ftu tidak bisa diubah lagi..');
                return false;            
            }
            this.takePhoto(photos,1);
          }
        },{
          text: 'Galeri Foto',
          icon:'images',
          handler: () => {
            if(this.status !='Pending' && this.status !='Terima'){
                this.api.showAlert('Ftu tidak bisa diubah lagi..');
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
            this.api.pushImage(this.datanya['nomor_ron'] + '-ftupart1.jpg', this.base64Image, 'part');
        }else if(photos==2){
            this.photo2 = this.base64Image;
            this.api.pushImage(this.datanya['nomor_ron'] + '-ftupart2.jpg', this.base64Image, 'part');
        }else if(photos==3){
          this.photo3 = this.base64Image;
          this.api.pushImage(this.datanya['nomor_ron'] + '-ftugaransi1.jpg', this.base64Image, 'garansi');
        }else if(photos==4){
          this.photo4 = this.base64Image;
          this.api.pushImage(this.datanya['nomor_ron'] + '-ftugaransi2.jpg', this.base64Image, 'garansi');
        }
        photos.reverse();
        
        
    }, (err) => {
      this.api.showAlert(err);
       console.log(err);
    });
  }

}
