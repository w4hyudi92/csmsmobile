import { Component } from '@angular/core';
import { App,ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-formretur',
  templateUrl: 'formretur.html',
  providers: [ApiProvider]
})
export class FormreturPage {

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


  constructor(public modalCtrl: ModalController, public navCtrl: NavController, 
    public navParams: NavParams,public api: ApiProvider,private storage: Storage,
    public appCtrl: App) {
    
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
    let modal = this.modalCtrl.create('ModalpartPage',
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

  simpandata(){

    let arr_part = [];
    for(var k = 0; k < this.arrData.length; k++){
      arr_part.push({
        item_desc: this.arrData[k]['item_desc'],
        itemno: this.arrData[k]['itemno'],
        qty: this.arrData[k]['qty'],
        unitprice_disc: this.arrData[k]['unitprice_disc'],
        tipe: this.arrData[k]['tipe'],
        reason: this.arrData[k]['alasan'],
        inventory_id: this.arrData[k]['inventory_id'],
      });
    }

    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'part',
        act: 'insert_return',
        note: "",
        total: this.total,
        part: JSON.stringify(arr_part),
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token,
        
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
          //this.navCtrl.push('ListreturPage');
          this.navCtrl.pop();
          //this.appCtrl.getRootNav().push('ListreturPage');
        }else{
            this.api.showAlert(data['error']['error']);
        }
      });
    });
   
  }

}
