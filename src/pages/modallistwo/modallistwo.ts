import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams,ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-modallistwo',
  templateUrl: 'modallistwo.html',
})
export class ModallistwoPage {

  public itemno:string;
  public param:any;
  public arr_token: any;
  no:number;
  filter: string;
  show: boolean = false;
  arrList=[];
 

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
    this.no=1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModallistwoPage');
    this.getData();
  }

  dismiss() {
    this.viewCtrl.dismiss();
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
          mod: 'list_ron',
          //konsumen_id: this.isi['konsumen_id'],
          usr: profile.nik,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
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
              this.api.showAlert(data['error']['text']);
              loader.dismiss();
          }
      });
    });
  }

  pilih(itm){
    console.log(itm);
    this.navParams.get('content').ronno = itm['nomor_ron'];
    this.navParams.get('content').perbaikan_id = itm['perbaikan_id'];
    this.viewCtrl.dismiss();
  }

  cariron(){
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.storage.get('prof').then(profile => {
      console.log(profile);
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'list_ron',
          act: 'cariron',
          usr: profile.nik,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token,
          filter: this.filter,
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
}
