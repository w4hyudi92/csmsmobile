import { Component } from '@angular/core';
import { LoadingController, ViewController, ModalController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { JualPartCheckoutPage } from './../jualpartcheckout/jualpartcheckout';

/**
 * Generated class for the MenupartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-jualpart',
  templateUrl: 'jualpart.html',
})
export class JualPart {
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

  constructor(
    public modalCtrl: ModalController, 
    public navCtrl: NavController, 
    public navParams: NavParams,
    public api: ApiProvider,
    private viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    private storage: Storage
  ) {
  }

  ionViewDidLoad() {
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
    this.hitungtotal();
    
  }

  checkout(){
    console.log(this.arrData);
    if(this.total == 0){
      alert("Pilih Accs terlebih dahulu!!");
    }else{
      this.navCtrl.push(JualPartCheckoutPage, {
        item: this.arrData,
      })
    }
    
  }

  hitungtotal(){
    let tot:number = 0
    for(var k = 0; k < this.arrData.length; k++){
      tot = tot + ( this.arrData[k]['unitprice_disc'] * this.arrData[k]['qty'])
    }
    this.total = tot;
  }

}
