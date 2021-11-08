import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';
import { IonicPage, NavController, NavParams, App  } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { ApiProvider } from '../../providers/api/api';
import { MenuPage } from '../menu/menu';
import { Device } from '@ionic-native/device';
/**
 * Generated class for the LogoutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
  providers: [ApiProvider]
})
export class LogoutPage {

  public param:any;
  public arr_token: any;
  devid:any = 'fM06td37jUA:APA91bEPOqU-y0bFor9X80jVxgATfoIiBA_3jXI_MCp7w4v8VFlCzcw9zc4tZnHAhY4uF5BiSS5UUAPE_D3PiL6_WEHB0FnOsMiXjG1intjPooyHsYWeotf0rRCH7nMyqBURLTaFjkzG';
  data_profile = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public app: App,
    private device: Device,
    private storage: Storage) {

    
    
    this.storage.get('prof').then(profile => {
      this.data_profile = profile;

      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'device',
          usr: this.data_profile['nik'],
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token,
          serial_no: this.device.serial,
          act:'logout'
          }
      };

      this.api.getApi(this.param).then(datareg => 
      {
          if(datareg['STATUS'] =="SUKSES") {
            storage.remove('login');
            storage.set('prof', '');
            console.log(datareg['data']);
            //this.navCtrl.setRoot(LoginPage);
            this.app.getRootNav().setRoot(LoginPage);
          }else{
            this.api.showAlert(datareg['MESSAGE']);
            this.navCtrl.setRoot(MenuPage);
          }
      });
    });

    

   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }

}
