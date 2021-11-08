import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the InfolimitPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-infolimit',
  templateUrl: 'infolimit.html',
  providers: [ApiProvider]
})
export class InfolimitPage {
  private param:any;
  private isi:any;
  private arr_token: any;
  arr_limit=[];

  constructor(public navCtrl: NavController, public navParams: NavParams,public api: ApiProvider,private storage: Storage) {
   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfolimitPage');
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

}
