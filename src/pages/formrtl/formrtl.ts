import { Component } from '@angular/core';
import { LoadingController, ViewController, ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the FormrtlPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-formrtl',
  templateUrl: 'formrtl.html',
  providers: [ApiProvider]
})
export class FormrtlPage {

  private param:any;
  private isi:any;
  private arr_token: any;
  arr_limit=[];
  arrData:any = [];
  show: boolean = false;
  total: number = 0;
  arr_draft:any = [];
  keterangan: string;
  ronno:string;
  perbaikan_id:string;


  constructor(public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FormrtlPage');
    this.arr_token = this.api.random();
    
    this.storage.get('prof').then(profile => {
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
          this.api.showAlert(data['MESSAGE']);
        }
      });
      
    });
  }

  pilih(){
    let modal = this.modalCtrl.create('ModelinfoPage',
      {
        content: this,
        limit: this.arr_limit["kredit_limit"] - this.arr_limit["rentalPrice"]
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
    this.hitungtotal();
    
  }

  hitungtotal(){
    let tot:number = 0
    for(var k = 0; k < this.arrData.length; k++){
      tot = tot + ( this.arrData[k]['unitprice_disc'] * this.arrData[k]['qty'])
    }
    this.total = tot;
  }
  cariron(){
    let modal = this.modalCtrl.create('ModallistwoPage',
      {
        content: this,
      });
    modal.present();
  }
  simpandata(){
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.viewCtrl.showBackButton(false);
    let arr_part = [];
    for(var k = 0; k < this.arrData.length; k++){
      arr_part.push({
        item_desc: this.arrData[k]['item_desc'],
        itemno: this.arrData[k]['itemno'],
        qty: this.arrData[k]['qty'],
        unitprice_disc: this.arrData[k]['unitprice_disc'],
      });
  }

    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'part',
        act: 'insert_rental',
        note: this.keterangan,
        total: this.total,
        part: JSON.stringify(arr_part),
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token,
        perbaikan_id: this.perbaikan_id
        }
    };
    console.log(this.param);
    this.storage.get('prof').then(profile => {
      this.param['params']['usr'] = profile.nik;
      this.param['params']['service_center_id'] = profile.service_center_id;
      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          alert('Sukses');
          loader.dismiss();
          //this.navCtrl.pop();
          this.navCtrl.popToRoot()
        }else{
            this.api.showAlert(data['error']['error']);
            loader.dismiss();
        }
      });
    });
   
  }
}
