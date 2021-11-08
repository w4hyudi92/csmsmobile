import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { PhotoViewer } from '@ionic-native/photo-viewer';
//import { LazyLoadImageModule } from 'ng-lazyload-image';
/**
 * Generated class for the LibraryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-library-detail',
  templateUrl: 'library-detail.html',
  providers: [ApiProvider]
})
export class LibraryDetailPage {

  public param:any;
  public arr_token: any;
  arrList=[];
  folder:string='';
  defaultImage:string='';
  admin:number;
  isfiltered: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private photoViewer: PhotoViewer,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
      this.admin = navParams.get("admin");
      this.folder = navParams.get("folder");
      this.defaultImage = 'https://www.placecage.com/1000/1000';
  }

  ionViewDidLoad() {
    this.getData();
  }
  getData() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'images',
          act: 'list',
          folder: this.folder,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      if(this.folder=='profil'){
        this.param['params']['act'] = 'profil';
      }
      this.storage.get('login').then(usr => {
        if(this.admin==0){
          this.param['params']['usr'] = usr;
        }
        this.api.getApi(this.param).then(data => 
        {
          if(data['data'] == undefined) {
            this.arrList = [];
            this.isfiltered= true;
          }else{
        
            if(this.folder=='profil'){
            
              this.arrList = this.objectToArray(data['data'][0]);
            }else{
              this.arrList = data['data'];
            }
            this.isfiltered= false;
          }
          loader.dismiss();
        });
      });
    });
  }
  objectToArray(obj) {
    var array = [], tempObject;
    for (var key in obj) {
      array.push(obj[key]);
  }
    return array;
  }

  viewPhoto(photos){
    this.photoViewer.show(photos);
  }
}
