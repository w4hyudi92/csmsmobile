import { Component, ViewChild } from '@angular/core';
import { App, MenuController, NavController, Slides, Events, LoadingController,ActionSheetController, ToastController,Platform } from 'ionic-angular';
import { ListwoPage } from './../listwo/listwo';
import { SchedulePage } from './../schedule/schedule';
import { PromisePage } from './../promise/promise';
import { MenupartPage } from './../menupart/menupart';
import { ListdraftPage } from './../listdraft/listdraft';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase , AngularFireList  } from 'angularfire2/database';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import { firebaseConfig,snapshootToArray } from '../../app/app.config.firebase';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device';
import { MenuksPage } from '../menuks/menuks';
import { MenuinformationPage } from '../menuinformation/menuinformation';
import { FtulistPage } from '../ftulist/ftulist';
import { ListcekhargaPage } from '../listcekharga/listcekharga';
import { ListinvoicePage } from '../listinvoice/listinvoice';
import { ListpendingPage } from '../listpending/listpending';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { MenusetorPage } from '../menusetor/menusetor';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiProvider]
})

export class HomePage {
  @ViewChild(Slides) slides: Slides;
  public slideData: any = [];
  private param:any;
  private arr_token: any;
  public imageURL:any =  './assets/images/profile.png';
  public base64Image : string;
  arr_limit=[];
  arr_headlines=[];
  moda: string = 'Production';
  versi: string;
  version:boolean=false;
  live_versi: string;
  data_profile = [];
  arrData = [];
  ref= firebase.database().ref('geolocations/');
  nik: string;

  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no'
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only
};
  
  constructor(
    public navCtrl: NavController, 
    menu: MenuController,
    public api: ApiProvider,
    private storage: Storage,
    private iab: InAppBrowser,
    public events: Events,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    private camera: Camera,
    private transfer: FileTransfer,
    private angDatabase: AngularFireDatabase,
    public platform: Platform,
    public geolocation: Geolocation,
    private device: Device,
    private app: App) {
      this.versi = 'v2.0.0';
      menu.enable(true);
      this.storage.get('mode').then(mode => {
        if(mode != null){
          this.moda = mode;
          this.events.publish('reload:created',Date.now());
        }
      });
      platform.ready().then(() => {
        this.storage.get('prof').then(profile => {
          this.nik= profile.nik;
          this.initMap();
        });
        
      });
      this.getData();
 

      //this.slideData = [{ image: "../../assets/images/draft-home.jpg" },{ image: "../../assets/images/draft-home2.jpg" },{ image: "../../assets/images/intro.jpg" }];
  }

  initMap() {
    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {
      
      this.updateGeolocation(this.device.uuid, data.coords.latitude,data.coords.longitude);
    
    });
  }

  updateGeolocation(uuid, lat, lng) {
    if(localStorage.getItem('mykey')) {
      firebase.database().ref('geolocations/'+localStorage.getItem('mykey')).set({
        uuid: uuid,
        latitude: lat,
        longitude : lng,
        date: moment().format("DD/MM/YYYY HH:mm:ss"),
        nik: this.nik
      });
    } else {
      let newData = this.ref.push();
      newData.set({
        uuid: uuid,
        latitude: lat,
        longitude: lng,
        date: moment().format("DD/MM/YYYY HH:mm:ss"),
        nik: this.nik
      });
      localStorage.setItem('mykey', newData.key);
    }
  }

  ionViewDidEnter() {
    this.refresh();
    this.imageURL =  './assets/images/profile.png';
    this.storage.get('foto_profil').then(foto => {
      if(foto !=null){
        this.imageURL = foto;
      }else{
        this.storage.get('prof').then(profile => {
          if(profile.profile != null){
            let param_image = {
              params: {
                target: '',
                file: '',
                }
            };
            param_image['params']['file'] = profile.profile;
            this.api.getImage(param_image).then(data => {
                if(data !="noexist"){
                    this.imageURL = 'data:image/jpeg;base64,'+ data;
                }
            });
          }
        });
      }
      
    });
  }
  getData() {
    //this.slides.autoplayDisableOnInteraction = false;
    
    this.arr_token = this.api.random();
    this.storage.get('prof').then(profile => {
      this.data_profile = profile;
      this.param = {
        params: {
        mod: 'part',
        act: 'info_rental',
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token,
        usr: profile.nik,
        service_center_id: profile.service_center_id,
        }
      };

      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          this.arr_limit = data['data'];
          console.log(this.arr_limit);
        }else{
          this.api.showAlert(data['error']['error']);
        }
      });
      
      this.param['params']['mod'] = 'device';
      // this.param['params']['act'] = 'headlines';
      // this.api.getApi(this.param).then(data => 
      // {

      //   if(data['STATUS'] =="SUKSES") {
      //     this.arr_headlines = data['data'];
      //   }
      // });
      this.param['params']['act'] = 'versi';
      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          this.live_versi=data['data']['versi_app'];
          if(data['data']['versi_app'] != this.versi){
            this.version=true;
          }
          
        }
      });
    });
    
  }
  

  refresh(){
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.storage.get('mode').then(mode => {
      if(mode != null){
        this.moda = mode;
        this.events.publish('reload:created',this.moda);
        this.events.publish('notifikasi:created',Date.now());
        this.getData();
        loader.dismiss();
      }else{
        loader.dismiss();
      }
    });
    
  }

  checkout() {
    this.app.getRootNav().push(ListwoPage);
  }
  cekharga() {
    //this.api.showAlert('Sedang dalam pengembangan..');
    this.app.getRootNav().push(ListcekhargaPage);
  }
  schedule() {
    this.app.getRootNav().push(SchedulePage);
  }

  promise() {
    this.app.getRootNav().push(PromisePage);
  }
  partmenu() {
    this.app.getRootNav().push(MenupartPage);
  }
  listdraft(){
    this.app.getRootNav().push(ListdraftPage);
  }
  ks(){
    this.api.showAlert('Sedang dalam pengembangan..');
    //this.app.getRootNav().push(MenuksPage);
  }

  setor_tunaimenu(){
    this.app.getRootNav().push(MenusetorPage);
  }

  template(){
    this.app.getRootNav().push(ListinvoicePage);
  }
  techforum(){
    this.app.getRootNav().push(MenuinformationPage);
  }
  limitinfo(){
    this.app.getRootNav().push('InfolimitPage');
  }
  detailnews(notif){
   
    this.app.getRootNav().push('DetailnotifikasiPage',{
      isi : notif
    });
  }
  listpending(){
    this.app.getRootNav().push(ListpendingPage);
  }
  ftu(){
    //this.api.showAlert('FTU Sedang dalam pengembangan..');
    this.app.getRootNav().push(FtulistPage);
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih Foto',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon:'camera',
          handler: () => {
            //this.takePhoto(1);
            this.takePicture(1);
          }
        },{
          text: 'Galeri Foto',
          icon:'images',
          handler: () => {
            //this.takePhoto(0);
            this.takePicture(0);
          }
        },
        {
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

  public takePicture(sourceType:number) {
    
    let options = {
        quality: 100,
        //destinationType: this.camera.DestinationType.DATA_URL,
        //destinationType: this.camera.DestinationType.FILE_URI,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        saveToPhotoAlbum: true,
        sourceType: sourceType,
        //correctOrientation: true,
        //cameraDirection: this.camera.Direction.FRONT
    };

    this.camera.getPicture(options).then((imageData) => {
        //this.base64Image = imageData;
        let loader = this.loadingCtrl.create({
            content: "Uploading..."
            });
        loader.present();

        const fileTransfer: FileTransferObject = this.transfer.create();
        this.base64Image = this.createFileName();
        let options1: FileUploadOptions = {
            fileKey: 'file',
            fileName: this.base64Image,
            headers: {}
        
        }
        
        fileTransfer.upload(imageData, 'http://103.86.154.244/apimobile/live/ws/upload/upload.php', options1)
        .then((data) => { 

            this.imageURL = 'http://103.86.154.244/apimobile/live/ws/upload/upload/'+ this.base64Image;
            this.api.setmemory('foto_profil',this.imageURL);
            this.storage.get('prof').then(profile => {
              this.arr_token = this.api.random();
              this.param = {
                  params: {
                  mod: 'notifikasi',
                  act: 'update_profile',
                  usr: profile.nik,
                  foto: this.base64Image,
                  rand: this.arr_token.rand,
                  sessid: this.arr_token.sessid,
                  token: this.arr_token.token
                  }
              };
              
              this.api.getApi(this.param).then(data => 
                {
                    if(data['STATUS'] =="SUKSES") {
                      
                    }else{
                      this.api.showAlert(data['MESSAGE']);
                    }
                });
            });
            loader.dismiss();
            this.presentToast("Image uploaded successfully");
        }, (err) => {
            loader.dismiss();
            this.presentToast("error"+JSON.stringify(err));
        });


    });

  }
  
  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom'
    });
  
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
  
    toast.present();
  }
  private createFileName() {
      var d = new Date(),
      n = d.getTime(),
      newFileName =  n + ".jpg";
      return newFileName;
  }
}
