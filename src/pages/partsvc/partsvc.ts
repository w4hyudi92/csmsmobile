import { Component } from '@angular/core';
import { ModalController, IonicPage, NavController, NavParams, Events  } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-partsvc',
  templateUrl: 'partsvc.html',
  providers: [ApiProvider]
})
export class PartsvcPage {
    searchTerm: string = '';
    private param:any;
    private arr_token: any;
    private isi:any;
    private data_ron:any;
    private itemPart:any;
    nik: string;
    isfiltered: boolean ;
    status: string;
    garansi: string;
    totalpart:number;
    arrList=[];

    constructor(public modalCtrl: ModalController,public navCtrl: NavController, 
        public navParams: NavParams,
        private storage: Storage,
        public events: Events,
        public api: ApiProvider,
        public http: HttpClient
    ) {
        this.arrList = []
        this.isfiltered = false;
        this.isi = navParams.get("isi");
        this.status = this.isi['status'];
        this.garansi = navParams.get("content")['garansi'];
        
        //console.log(this.isi);
        this.storage.get('login').then(login => {
          this.nik= login;
        });
    }
    

  ionViewDidLoad() {
    this.setFilteredItems();  
    console.log('ionViewDidLoad PartsvcPage');
    this.totalpart = 0;
    this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'repair',
          act: 'pemakaian_part',
          perbaikan_id: this.isi['perbaikan_id'],
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      this.storage.get('prof').then(profile => {
        this.api.getApi(this.param).then(data => 
        {
          console.log(this.navParams.get('content'));
            if(data['STATUS'] =="SUKSES") {
              this.itemPart = data['data'];
              if(data['data'].length>0) {
                this.isfiltered = true;
                
                // if(this.navParams.get("status") == 'Pending' || this.navParams.get("status") == 'Terima'){
                //   this.hitungbiaya();
                // }
              }
              this.navParams.get('content').itemPart = this.itemPart;
              this.hitungbiaya();
            }else{
              this.api.showAlert(data['MESSAGE']);
            }
        });
      });
  }

  setFilteredItems() {  
    this.arrList = this.filterItems(this.searchTerm);  
  }  

  filterItems(searchTerm){  
    return this.arrList.filter((itm) => {  
      return itm.item_desc.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;  
    });     
  } 

  openModal(characterNum) {

    let modal = this.modalCtrl.create('ModalPage', {
        isi: this.isi
      });
    modal.onDidDismiss(() => {
        this.ionViewDidLoad();
        this.isfiltered = false;
      });
    modal.present();
  }

  hapus(itemno){

    for(var k = 0; k < this.itemPart.length; k++){
      if(this.itemPart[k]['kode_part'] == itemno.kode_part){
        this.arr_token = this.api.random();
        this.param = {
            params: {
            mod: 'repair',
            act: 'hapus_part',
            perbaikan_id: this.isi['perbaikan_id'],
            inventory_id: this.itemPart[k]['inventory_id'],
            qty: this.itemPart[k]['kuantitas'],
            biaya_id: this.itemPart[k]['biaya_id'],
            usr: this.nik,
            rand: this.arr_token.rand,
            sessid: this.arr_token.sessid,
            token: this.arr_token.token
            }
        };
        this.storage.get('prof').then(profile => {
          this.api.getApi(this.param).then(data => 
            {
              //console.log(data);
                if(data['STATUS'] =="SUKSES") {
                  this.events.publish('biaya:created',Date.now());
                  this.ionViewDidLoad();
                  
                }else{
                  this.api.showAlert(data['MESSAGE']);
                }
            });
        });
      }
    }
  }

  hitungbiaya(){
    let arr_charge = this.navParams.get('content').arr_charge;
    let bpart = 0;
    let npart = 0;
    for(var k = 0; k < this.itemPart.length; k++){
            bpart = bpart + (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
            npart = bpart;
    }
    
    arr_charge['part'] = npart;

    if(this.garansi=='204'){
      arr_charge['b_part'] = npart;
      arr_charge['disc_part'] = 100;
      arr_charge['net_part'] = 0;
      arr_charge['part'] = 0;
    }

    arr_charge['angkut'] = (arr_charge['net_angkut']== undefined ? 0 : arr_charge['net_angkut']);
    arr_charge['kerja'] = (arr_charge['net_kerja']== undefined ?  (arr_charge['b_kerja']== undefined ? 0 : arr_charge['b_kerja']) : arr_charge['net_kerja']);
    arr_charge['kunjungan'] = (arr_charge['net_kunjungan']== undefined ? 0 : arr_charge['net_kunjungan']);
    arr_charge['lain'] = (arr_charge['net_lain']== undefined ? 0 : arr_charge['net_lain']);
    arr_charge['material'] = (arr_charge['net_material']== undefined ? 0 : arr_charge['net_material']);
   
    // if(parseFloat(arr_charge['disc_kerja'])>0) {
    //     let ndisc_kerja = (parseFloat(arr_charge['disc_kerja'])/100) * arr_charge['kerja'];
    //     arr_charge['kerja'] = arr_charge['kerja']- ndisc_kerja;
    // }

    // if(parseFloat(arr_charge['disc_angkut'])>0) {
    //   let ndisc_angkut = (parseFloat(arr_charge['disc_angkut'])/100) * arr_charge['angkut'];
    //   arr_charge['angkut'] = arr_charge['angkut']- ndisc_angkut;
    // }
    // if(parseFloat(arr_charge['disc_kunjungan'])>0) {
    //   let ndisc_kunjungan = (parseFloat(arr_charge['disc_kunjungan'])/100) * arr_charge['kunjungan'];
    //   arr_charge['kunjungan'] = arr_charge['kunjungan']- ndisc_kunjungan;
    // }
    // if(parseFloat(arr_charge['disc_lain'])>0) {
    //   let ndisc_lain = (parseFloat(arr_charge['disc_lain'])/100) * arr_charge['lain'];
    //   arr_charge['lain'] = arr_charge['lain']- ndisc_lain;
    // }
    // if(parseFloat(arr_charge['disc_material'])>0) {
    //   let ndisc_material = (parseFloat(arr_charge['disc_material'])/100) * arr_charge['material'];
    //   arr_charge['material'] = arr_charge['material']- ndisc_material;
    // }

    this.navParams.get('content').total = parseFloat(arr_charge['kerja']) + arr_charge['angkut'] + arr_charge['lain'] + arr_charge['part'] + arr_charge['material'] + arr_charge['kunjungan'];
    this.totalpart = npart;
    console.log(arr_charge);
  }
}
