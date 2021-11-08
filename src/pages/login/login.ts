import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Device } from '@ionic-native/device';
import { AlertController,ToastController, IonicPage, NavController, NavParams, MenuController  } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { MenuPage } from '../menu/menu';

//import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { ApiProvider } from '../../providers/api/api';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [ApiProvider]
})
export class LoginPage {
  input = {
    email: '',
    password: ''
  }
  maxlogin: number = 0;
  public param:any;
  public arr_token: any;
  devid:any = 'cdpqvof4zW4:APA91bHD-UaJl0di4d7lAUfjHnNuiArLhn5Zt53IlU7Ilv30eoN2TKXWqRG2wmfZyESEDzTtw2rF164BnyCFXaZr5G-H-vmNMS-0mJLB4MlTIWn8XVlNhx__dwWpB6QmKgMpb3SBtP5h';
  permitchange:string = '';

  constructor(public navCtrl: NavController, public navParams: NavParams, menuCtrl: MenuController,
    private storage: Storage,
    private device: Device,
    public toastCtrl: ToastController,
    //public push: Push,
    //private sqlite: SQLite,
    public api: ApiProvider,
    private alertCtrl: AlertController,
    private httpClient: HttpClient)
  {
    this.permitchange = navParams.get("gantiteknisi");
    if(this.permitchange!='1'){
        storage.get('login').then(getData => {
            if (getData) {
              this.navCtrl.setRoot(MenuPage);
            }
        });
    }
   
  }


  ionViewDidLoad() {
    this.storage.get('deviceid').then(dev => {
        this.devid = dev;
    });

  }

  showAlert(msg) {
      let alert = this.alertCtrl.create({
          title: 'Server tidak merespon!',
          subTitle: msg,
          buttons: ['OK']
      }).present();
  }
  public register()
  {
    this.navCtrl.setRoot('RegisterPage');
  }
  
  // kebijakan(){
  //   this.maxlogin = this.maxlogin + 1;
  //   if(this.maxlogin==15){
  //       alert('Login Auto Berhasil');
  //       let datalog = {"pengguna_id":"sztk60","nik":"sztk60","nama":"TMM - RIFALDI TANJUNG","nama_lengkap":"TMM - RIFALDI TANJUNG ","password":"e64b78fc3bc91bcbc7dc232ba8ec59e0","service_center_id":"9C9BF631-152E-4ABE-BA3A-0E199D2E7E7E","email":null,"aktif":"1","jabatan":"1","session_aktif":null,"ip_address":null,"logtime":null,"expire_password":null,"cti_usage":"0","telepon":"085810452599","tgl_input":"2017-11-14 11:45:48.903","pic_input":"admin","tgl_update":"2018-10-02 15:52:47.660","pic_update":"1111.1111","alamat":null,"status_pengguna":"691","peran_id":"ADDEF1D3-2D70-4227-8DB5-E6459147BE1B","nama_peran":"Teknisi","service_center_des":"SVC-01 - SERVICE CENTER JAKARTA 1"};
  //       this.api.setmemory('prof',datalog);
  //       this.storage.set('login','sztk60');
  //       this.navCtrl.setRoot(MenuPage);
  //   }
    
  // }
  public loginapp()
  {
    if(this.permitchange=='1'){
        this.arr_token = this.api.random();
        this.param = {
            params: {
            mod: 'device',
            usr: this.input.email,
            act: 'biodata',
            rand: this.arr_token.rand,
            sessid: this.arr_token.sessid,
            token: this.arr_token.token
            }
        };
        this.api.getApi(this.param).then(data => 
        {
            this.api.setmemory('prof',data['data']);
            this.storage.set('login',this.input.email);
            this.navCtrl.setRoot(MenuPage);
        });
       
    }else{
        let valid = this.validateForm();
    
        if(valid){
            this.arr_token = this.api.random();
            this.param = {
                params: {
                mod: 'login',
                usr: this.input.email,
                pass: this.input.password,
                rand: this.arr_token.rand,
                sessid: this.arr_token.sessid,
                token: this.arr_token.token
                }
            };

            this.api.getApi(this.param).then(data => 
            {
                
                this.api.data_teknisi = data['data'];
                console.log(this.api.data_teknisi);
                if(data['STATUS'] =="SUKSES") {
                    this.api.setmemory('prof',data['data']);
                    this.storage.set('login',this.input.email);

                    this.param['params']['mod'] = 'device';
                    this.param['params']['dev'] = this.devid;
                    this.param['params']['act'] = 'reg';
                    this.param['params']['version'] = this.device.version;
                    this.param['params']['manufacturer'] = this.device.manufacturer;
                    this.param['params']['serial_no'] = this.device.serial;
                    this.param['params']['model'] = this.device.model;
                    this.param['params']['versi_apk'] = 'v2.0.0';

                    this.api.getApi(this.param).then(datareg => 
                    {
                        if(datareg['STATUS'] =="SUKSES") {
                            //this.navCtrl.setRoot(MenuPage);
                        }else{
                            this.showAlert(JSON.stringify(datareg['MESSAGE']));
                        }
                    });

                    
                    this.navCtrl.setRoot(MenuPage);
                }else if(data['STATUS'] =="CEKLAGI"){
                  this.showAlert("Anda sudah login diperangkat lain..");
                }else{
                    this.showAlert(JSON.stringify(data['MESSAGE']));
                }
            });

        }
    }
    
    
  }

    // createTable(){
    //     this.sqlite.create({
    //         name: 'csms.db',
    //         location: 'default'
    //     }).then((db: SQLiteObject) => {
    //         db.executeSql('CREATE TABLE IF NOT EXISTS draft_wo(ron VARCHAR(50) PRIMARY KEY, tgl VARCHAR(10), tipe VARCHAR(10), model VARCHAR(10), serial VARCHAR(10), tgl_beli date, stok_dealer VARCHAR(10), no_garansi VARCHAR(50), pending int(1), alasan_tertunda VARCHAR(100),level_perbaikan VARCHAR(100),kode_keluhan VARCHAR(10),kode_defect VARCHAR(10), kode_perbaikan VARCHAR(10), keterangan text, catatan_teknisi text ))', {})
    //         .then(res => console.log('Executed SQL'))
    //         .catch(e => console.log(e));
    
    //     }).catch(e => console.log(e));
    // }

  validateForm() {
      if (this.input.email.length == 0 || this.input.password.length == 0) {
        const toast = this.toastCtrl.create({
          message: 'Email/Password tidak boleh kosong.',
          duration: 3000,
          position: 'top'
        });
        toast.present(toast);
        return false;
      }
      else {
          return true;
      }
  }
}
