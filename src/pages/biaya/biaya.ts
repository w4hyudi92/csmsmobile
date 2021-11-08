import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the BiayaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-biaya',
  templateUrl: 'biaya.html',
  providers: [ApiProvider]
})
export class BiayaPage {
  public matauang: string;
  private param:any;
  private arr_token: any;
  private isi:any;
  private itemPart:any = [];
  private itemCurrency:any;
  private itemOngkos:any;
  private itemAngkut:any;
  private itemLainnya: any;
  private itemMaterial: any;

  pTotal:number;
  total:number;
  bkerja:number;

  bangkut:number;
  nangkut:number;
  dangkut:number;

  nkerja:number;
  dkerja:number;

  blain:number;
  dlain:number;
  nlain:number;

  bpart:number;
  dpart:number;
  npart:number;

  bmaterial:number;
  dmaterial:number;
  nmaterial:number;

  ongkos:number;
  dkunjungan:number;
  nkunjungan:number;

  curr:string;
  values:Array<string> = [];
  discpartany:boolean;

  arr_data:any = [];
  garansi:string;
  garansi_desc:string;
  ready:any = [];
  isfiltered: boolean ;
  iReady:boolean;
  history:boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage,
    public events: Events,
    public api: ApiProvider) {
      this.isfiltered = false;
      this.bkerja = parseFloat(navParams.get("kerja"));
      this.nkerja= parseFloat(navParams.get("kerja"));
      this.history = navParams.get("history");
      this.isi = navParams.get("isi");
      this.garansi = navParams.get("content").garansi;
      this.garansi_desc = navParams.get("content").garansi_desc;
      

      this.ready = navParams.get("content").arr_charge;
      console.log(this.ready);
      events.subscribe('biaya:created', eventData => { 
        console.log('masuk biaya');
        console.log(navParams.get("content"));
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
              if(data['STATUS'] =="SUKSES") {
                this.itemPart = data['data'];
                navParams.get("content").arr_charge.item_part =this.itemPart;
              }
          });
        });

      });

  }

  isReady(){
    if(this.ready['b_angkut'] != undefined){
      this.iReady = true;
      
      this.discpartany = this.ready['discpartany'];
      this.bangkut= this.ready['b_angkut'];
      this.dangkut= this.ready['disc_angkut'];
      this.nangkut= this.ready['net_angkut'];

      this.bkerja= this.ready['b_kerja'];
      this.dkerja= this.ready['disc_kerja'];
      this.nkerja= this.ready['net_kerja'];
     
      this.blain= this.ready['b_lain'];
      this.dlain= this.ready['disc_lain'];
      this.nlain= this.ready['net_lain'];

      this.bpart= this.ready['b_part'];
      this.dpart= this.ready['disc_part'];
      this.npart= this.ready['net_part'];

      this.bmaterial= this.ready['b_material'];
      this.dmaterial= this.ready['disc_material'];
      this.nmaterial= this.ready['net_material'];
      
      this.ongkos= this.ready['ongkos_kunjungan'];
      this.dkunjungan= this.ready['disc_kunjungan'];
      this.nkunjungan= this.ready['net_kunjungan'];

      this.matauang= this.ready['matauang'];
      this.curr= this.ready['curr'];
      this.total= this.ready['total'];
      this.itemPart= this.ready['item_part'];
      this.getDataPart();
    }else{
      this.iReady = false;
      this.discpartany = false;
      this.bangkut=0;
      this.dangkut=0;
      this.nangkut=0;

      this.dkerja=0;
      this.blain=0;
      this.dlain=0;
      this.nlain=0;

      this.bpart=0;
      this.dpart=0;
      this.npart=0;

      this.bmaterial=0;
      this.dmaterial=0;
      this.nmaterial=0;
      
      this.ongkos=0;
      this.dkunjungan=0;
      this.nkunjungan=0;

      this.matauang="901"
      this.curr="IDR"
      this.checkgaransi();
    }
    
  }

  ionViewDidLoad() {
    this.isReady();
    console.log(this.isfiltered);
    if(this.ready['b_angkut']== undefined){
      this.getDataPart();
    }
    
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
      //Ongkos Kunjungan
      this.param['params']['act'] = 'ongkos_kunjungan';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemOngkos = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });
      //Ongkos Angkut
      this.param['params']['act'] = 'ongkos_angkut';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemAngkut = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      //Ongkos Lainnya
      this.param['params']['act'] = 'ongkos_lainnya';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemLainnya = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      //Ongkos Material
      this.param['params']['act'] = 'ongkos_material';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemMaterial = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      this.param['params']['act'] = 'mata_uang';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemCurrency = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });
    });
    
    if(this.history){
      this.ongkos= parseFloat(this.isi['biaya_kunjungan']);
      this.nkunjungan= this.isi['biaya_kunjungan'];
      this.nkerja= this.isi['biaya_kerja'];
    }
  }

  getDataPart(){
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
            if(data['STATUS'] =="SUKSES") {
                if(data['data'].length==0){
                  this.bpart=0;
                }
                if(data['data'].length != this.itemPart.length){
                  this.discpartany = false;
                  this.itemPart = data['data'];
                  
                  console.log(this.itemPart);
                  for(var k = 0; k < this.itemPart.length; k++){
                      this.isfiltered = true;
                      if(this.iReady){
                          this.values[k] = (this.itemPart[k]['disc_part']== undefined ? 0 : this.itemPart[k]['disc_part']);
                          if(this.itemPart[k]['disc_part']== undefined){
                            this.itemPart[k]['disc_part'] = 0;
                            this.itemPart[k]['net_biaya'] = (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
                            this.checkgaransi();
                            this.bpart = this.bpart + (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
                            this.npart = this.bpart;
                          }
                          
                      }else{
                        if(this.garansi=='204'){
                          this.values[k] = "100";
                          this.itemPart[k]['disc_part'] =100;
                          this.itemPart[k]['net_biaya'] = 0;
                        }else{
                          this.values[k] = "0";
                          this.itemPart[k]['disc_part'] = 0;
                          this.itemPart[k]['net_biaya'] = (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
                        }
                        this.bpart = this.bpart + (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
                        this.npart = this.bpart;
                      }
                  }
                }else{
                  this.bpart=0;
                  for(var k = 0; k < this.itemPart.length; k++){
                      this.isfiltered = true;
                      this.values[k] = this.itemPart[k]['disc_part'];
                      this.bpart = this.bpart + (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
                  }
                }
          
                this.summary();
            }else{
                this.api.showAlert(data['MESSAGE']);
            }
          });
      });
  }
  showHasil(anad) {
     if(this.discpartany==false){
       this.checkgaransi();
        this.resetDiskon();
     }else{
        this.dpart=0;
        this.summary();
     }
  }

  calcBangkut(ang) {
      this.bangkut = ang;
      this.summary();
  }
  calcDangkut(ang){
    if(this.dangkut > 100){
      this.api.showAlert('Cek nilai diskon!');
      this.dangkut = 0;
    }else if (this.dangkut < 0){
      this.api.showAlert('Cek nilai diskon!');
      this.dangkut = 0;
    }else{
      this.dangkut=ang;
      this.summary();
    }
  }
  calcDkerja(ang){
    if(this.dkerja > 100){
      this.api.showAlert('Cek nilai diskon!');
      this.dkerja = 0;
    }else if (this.dkerja < 0){
      this.api.showAlert('Cek nilai diskon!');
      this.dkerja = 0;
    }else{
      this.dkerja=ang;
      this.summary();
    }
  }
  calcBlain(ang){
    this.blain=ang;
    this.summary();
  }

  calcDlain(ang){
    if(this.dlain > 100){
      this.api.showAlert('Cek nilai diskon!');
      this.dlain = 0;
    }else if (this.dlain < 0){
      this.api.showAlert('Cek nilai diskon!');
      this.dlain = 0;
    }else{
      this.dlain=ang;
      this.summary();
    }
  }

  calcDpart(ang){
    if(this.dpart > 100){
      this.api.showAlert('Cek nilai diskon!');
      this.dpart = 0;
    }else if (this.dpart < 0){
      this.api.showAlert('Cek nilai diskon!');
      this.dpart = 0;
    }else{
      this.dpart=ang;
      this.summary();
    }
  }


  calcBmaterial(ang){
    this.bmaterial=ang;
    this.summary();
  }

  calcDmaterial(ang){
    if(this.dmaterial > 100){
      this.api.showAlert('Cek nilai diskon!');
      this.dmaterial = 0;
    }else if (this.dmaterial < 0){
      this.api.showAlert('Cek nilai diskon!');
      this.dmaterial = 0;
    }else{
      this.dmaterial=ang;
      this.summary();
    }
  }

  calcDkunjungan(kun){
    if(this.dkunjungan > 100){
      this.api.showAlert('Cek nilai diskon!');
      this.dkunjungan = 0;
    }else if (this.dkunjungan < 0){
      this.api.showAlert('Cek nilai diskon!');
      this.dkunjungan = 0;
    }else{
      this.dkunjungan=kun;
      this.summary();
    }
  }

  onChangeOngkos(kos){
    console.log(kos);
    this.ongkos= parseFloat(kos);
    this.summary();
  }

  onChangeMataUang(uang){
    for(var k = 0; k < this.itemCurrency.length; k++){
      if(this.itemCurrency[k]['meta_value'] == uang){
        this.curr = this.itemCurrency[k]['meta_value_deskripsi'];
      }
    }
    this.summary();
  }

  valChange(value:string, index:number):void{
      this.values[index] = value;
      this.itemPart[index]['disc_part'] = value;
      this.itemPart[index]['net_biaya'] = (parseFloat(this.itemPart[index]['kuantitas']) * parseFloat(this.itemPart[index]['nilai_biaya'])) - ((parseFloat(value)/100 ) * (parseFloat(this.itemPart[index]['kuantitas']) * parseFloat(this.itemPart[index]['nilai_biaya'])));
      this.summary();

    }

  summary(){
    
    let ndisc1 = (this.dangkut/100) * this.bangkut;
    this.nangkut = this.bangkut - ndisc1;

    let ndisc2 = (this.dkerja/100) * this.bkerja;
    this.nkerja = this.bkerja - ndisc2;

    let ndisc3 = (this.dlain/100) * this.blain;
    this.nlain = this.blain - ndisc3;
   
    this.hitungulangpart();

    if(this.discpartany==false){
      let ndisc4 = (this.dpart/100) * this.bpart;
      this.npart = this.bpart - ndisc4;
    }
    

    let ndisc5 = (this.dmaterial/100) * this.bmaterial;
    this.nmaterial = this.bmaterial - ndisc5;

    let ndisc6 = (this.dkunjungan/100) * this.ongkos;
    this.nkunjungan = this.ongkos - ndisc6;

   
    //this.checkgaransi();
    if(this.history){
      this.ongkos= parseFloat(this.isi['before_kunjungan']);
      this.nkunjungan= parseFloat(this.isi['biaya_kunjungan']);
      this.nkerja= parseFloat(this.isi['biaya_kerja']);
      this.npart= parseFloat(this.isi['biaya_part']);
      this.nangkut= parseFloat(this.isi['biaya_angkut']);
      this.nlain= parseFloat(this.isi['biaya_lainya']);
      this.nmaterial= parseFloat(this.isi['biaya_material']);
    }
    this.total = this.nkerja + this.nangkut + this.nlain + this.npart + this.nmaterial + this.nkunjungan;
    this.navParams.get('content').total = this.total;

    this.insertSession();

  }

  checkgaransi(){
    //debugger;
    if(this.garansi=='204'){
      this.dpart= ((this.isi['status']=='Terima' || this.isi['status']=='Pending') ? 0 : parseInt(this.isi["diskon_part"]));
      this.npart=0;
      this.dangkut= ((this.isi['status']=='Terima' || this.isi['status']=='Pending') ? 0 : parseInt(this.isi["diskon_angkut"]));
      this.nangkut=0;
      this.dkerja= ((this.isi['status']=='Terima' || this.isi['status']=='Pending') ? 0 : parseInt(this.isi["diskon_kerja"]));
      this.nkerja=0;
      this.dlain= ((this.isi['status']=='Terima' || this.isi['status']=='Pending') ? 0 : parseInt(this.isi["diskon_lainya"]));
      this.nlain=0;
      this.dmaterial= ((this.isi['status']=='Terima' || this.isi['status']=='Pending') ? 0 : parseInt(this.isi["diskon_material"]));
      this.nmaterial=0;
      this.dkunjungan= ((this.isi['status']=='Terima' || this.isi['status']=='Pending') ? 0 : parseInt(this.isi["diskon_kunjungan"]));
      this.ongkos=0;

      for(var k = 0; k < this.itemPart.length; k++){
        this.values[k] = "100";
        this.itemPart[k]['disc_part'] = 100;
        this.itemPart[k]['net_biaya'] = 0;
      }
    }
  }

  insertSession(){
    this.arr_data['b_part'] = this.bpart;
    this.arr_data['disc_part'] = this.dpart;
    this.arr_data['net_part'] = this.npart;

    this.arr_data['b_angkut'] = this.bangkut;
    this.arr_data['disc_angkut'] = this.dangkut;
    this.arr_data['net_angkut'] = this.nangkut;

    this.arr_data['b_kerja'] = this.bkerja;
    this.arr_data['disc_kerja'] = this.dkerja;
    this.arr_data['net_kerja'] = this.nkerja;

    this.arr_data['b_lain'] = this.blain;
    this.arr_data['disc_lain'] = this.dlain;
    this.arr_data['net_lain'] = this.nlain;

    this.arr_data['b_material'] = this.bmaterial;
    this.arr_data['disc_material'] = this.dmaterial;
    this.arr_data['net_material'] = this.nmaterial;

    this.arr_data['ongkos_kunjungan'] = this.ongkos;
    this.arr_data['disc_kunjungan'] = this.dkunjungan;
    this.arr_data['net_kunjungan'] = this.nkunjungan;

    this.arr_data['item_part'] = this.itemPart;
    this.arr_data['total'] = this.total;

    this.arr_data['matauang'] = this.matauang;
    this.arr_data['discpartany'] = this.discpartany;
    this.arr_data['curr'] = this.curr;
    this.navParams.get('content').arr_charge = this.arr_data;
    console.log(this.arr_data);
  }

  hitungulangpart(){
    this.npart = 0;
    let isNetBiaya:boolean=false;
    if(this.itemPart != undefined){
      for(var k = 0; k < this.itemPart.length; k++){
        if(this.itemPart[k]['net_biaya']==undefined){
            this.npart = this.npart + parseFloat(this.itemPart[k]['nilai_biaya']);
            isNetBiaya = true;
        }else{
            this.npart = this.npart + parseFloat(this.itemPart[k]['net_biaya']);
        }
      }
    }
    //if(isNetBiaya){
      //  this.bpart = this.npart;
    //}
  }

  resetDiskon(){
    this.npart=this.bpart;
    for(var k = 0; k < this.itemPart.length; k++){
      this.values[k] = "0";
      this.itemPart[k]['disc_part'] = 0;
      this.itemPart[k]['net_biaya'] = (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
    }
    this.total = this.nkerja + this.nangkut + this.nlain + this.npart + this.nmaterial + this.ongkos;
    this.navParams.get('content').total = this.total;
    this.insertSession();
  }
}
