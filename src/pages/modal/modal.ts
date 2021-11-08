import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, Platform, Events  } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modal',
  templateUrl: 'modal.html',
  providers: [ApiProvider]
})
export class ModalPage {
  character;
  private param:any;
  private arr_token: any;
  private isi: any;
  private itemRental:any;
  private itemKategori:any;
  private part:any;
  kategori:string;
  qty: number;
  isfiltered:boolean;

  constructor(
    public platform: Platform,
    public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage,
    public events: Events,
    public viewCtrl: ViewController
  ){
      this.isi = navParams.get("isi");
      this.kategori="0";
      console.log(this.isi);
      this.isfiltered = false;
     
     
  }

  ionViewDidLoad() {

    console.log('ionViewDidLoad ModalPage');
    this.isfiltered = false;
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'repair',
          act: 'rental_status',
          svc_id: profile.service_center_id,
          teknisi_id: profile.nik,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };

      this.api.getApi(this.param).then(data => 
      {
        console.log(data);
          if(data['STATUS'] =="SUKSES") {
            this.itemRental = data['data'];
            if(data['data']== undefined) {
              this.isfiltered = true;
            }
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      this.param['params']['act'] = 'kategori_part';
      this.api.getApi(this.param).then(data => 
        {
          console.log(data);
            if(data['STATUS'] =="SUKSES") {
              this.itemKategori = data['data'];
            }else{
              this.api.showAlert(data['MESSAGE']);
            }
        });
    });
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  gunakan(){

    if(this.part== undefined) {
      this.api.showAlert('Pilih Accs terlebih dahulu');
      return false;
    }

    for(var k = 0; k < this.itemRental.length; k++){
      if(this.itemRental[k]['itemno'] == this.part){

        if(this.qty > parseInt(this.itemRental[k]['qty_avail'])) {
          this.api.showAlert('Qty tidak boleh melebihi Qty Available..');
          return false;
        }
        if(this.qty <= 0) {
          this.api.showAlert('Qty tidak boleh kurang dari 1');
          return false;
        }
        if(this.kategori == '0') {
          this.api.showAlert('Kategori harus dipilih.');
          return false;
        }
        
        this.arr_token = this.api.random();
        this.param = {
            params: {
            mod: 'repair',
            act: 'insert_part',
            perbaikan_id: this.isi['perbaikan_id'],
            konsumen_id: this.isi['konsumen_id'],
            kode_kategori: this.kategori,
            qty: this.qty,
            kode_biaya: this.itemRental[k]['itemno'],
            nilai_biaya: this.itemRental[k]['unitprice'],
            inventory_id: this.itemRental[k]['inventory_id'],
            rand: this.arr_token.rand,
            sessid: this.arr_token.sessid,
            token: this.arr_token.token
            }
        };
        console.log(this.param);
        this.storage.get('prof').then(profile => {
          this.param['params']['usr'] = profile.nik;
          this.api.getApi(this.param).then(data => 
          {
              if(data['STATUS'] =="SUKSES") {
                this.events.publish('biaya:created',Date.now());
                this.viewCtrl.dismiss();
              }else{
                this.api.showAlert(data['MESSAGE']);
              }
          });
        });
      }
    }

    
  }
}
