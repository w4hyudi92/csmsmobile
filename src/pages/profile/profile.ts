import { Component } from '@angular/core';
import { IonicPage,Platform, NavController, NavParams, ActionSheetController, LoadingController, ToastController  } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera';
//import { Transfer, TransferObject } from '@ionic-native/transfer';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';


declare var cordova: any;

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
  providers: [ApiProvider]
})
export class ProfilePage {
  data_profile = [];
  public imageURL:any =  './assets/images/profile.png';
  imageFileName:any;
  imageURI:any;

  public photos : any;
  public base64Image : string;
  private param:any;
  private arr_token: any;
  expenses: any = [];
  lastImage: string = null;
  //loading: Loading;
  letterObj = {
    to: '',
    from: '',
    text: ''
  }
 
  pdfObj = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public platform: Platform,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    private transfer: FileTransfer ,
    private storage: Storage,
    public toastCtrl: ToastController,
   
    private camera: Camera
    ) 
    {
      

  }

  ionViewDidEnter() {
    this.storage.get('prof').then(profile => {
       
      this.data_profile = profile;
      
    });
    this.imageURL =  './assets/images/profile.png';
    this.storage.get('foto_profil').then(foto => {
      if(foto !=null){
        this.imageURL = foto;
      }
      
    });

   
    this.photos = [];
  }

  

  takePhoto(sourceType:number){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      //destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: sourceType,
      correctOrientation: true,
      cameraDirection: this.camera.Direction.FRONT
    }
    this.camera.getPicture(options).then((imageData) => {
        //this.base64Image = "data:image/jpeg;base64," + imageData;
        this.base64Image = imageData;
        // this.photos.push(this.base64Image);
        // this.photos.reverse();
        this.imageURL = this.base64Image;

        this.api.setmemory('foto_profil',this.base64Image);

        this.imageURL.reverse();

    }, (err) => {
      this.api.showAlert(err);
       console.log(err);
    });
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
            //alert(this.imageURL);
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
