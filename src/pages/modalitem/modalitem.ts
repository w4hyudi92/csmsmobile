import { Component } from '@angular/core';
import { AlertController ,LoadingController, IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ModalitemPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalitem',
  templateUrl: 'modalitem.html',
})
export class ModalitemPage {

  public itemno:string;
  public param:any;
  public arr_token: any;
  arrList=[];
  arrModel=[];
  isfiltered: boolean ;
  filter: string;
  no:number;
  show: boolean = false;
  task: boolean = false;
  qty: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    public events: Events,
    private storage: Storage) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalitemPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  pilih(){
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.storage.get('prof').then(profile => {
      console.log(profile);
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'part',
          act: 'produk_master',
          usr: profile.nik,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token,
          model: this.filter,
          no: this.no
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        console.log(data);
          if(data['STATUS'] =="SUKSES") {
           if(data['data'] == undefined) {
            this.arrList = [];
            this.show= false;
           }else{
            this.arrList = data['data'];
            this.show= true;
           }
           loader.dismiss();
          }else{
              this.api.showAlert(data['MESSAGE']);
              loader.dismiss();
          }
      });
    });
  }

  itemSelected(itm){
    this.navParams.get('content').modelno = itm.model;
    this.navParams.get('content').product_no = itm.itemno;
    this.navParams.get('content').serialno = '';
    this.navParams.get('content').isi['prod_categ'] = itm.model;
    this.events.publish('resetdefect:created',Date.now());
    this.viewCtrl.dismiss();
  }
}
