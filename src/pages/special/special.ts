import { Component } from '@angular/core';
import { App, IonicPage, NavController, NavParams,Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { LoginPage } from './../login/login';
import { ListdraftPage } from './../listdraft/listdraft';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser,InAppBrowserOptions } from '@ionic-native/in-app-browser';
/**
 * Generated class for the SpecialPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-special',
  templateUrl: 'special.html',
  providers: [ApiProvider]
})
export class SpecialPage {

  show: boolean = false;
  maxlogin: number = 0;
  moda: string = 'Production';

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
    private app: App,
    public events: Events,
    //private iab: InAppBrowser,
    public api: ApiProvider,) {
      this.storage.get('mode').then(mode => {
        if(mode != null){
          this.moda = mode;
        }
      });
  }

  ionViewDidEnter() {
    this.maxlogin=0;
    this.show=false;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad SpecialPage');
  }
  mylist(){
    this.navCtrl.push('BluetoothPage');
  }
  clearsesi(){
    this.storage.remove('waktu_kunjungan');
    this.storage.remove('draft_ron');
    this.storage.remove('mode');
  }
  logout(){
    this.storage.remove('mode');
    this.navCtrl.push('LogoutPage');
    //this.navCtrl.setRoot(LoginPage);
  }
  akunsaya(){
    this.navCtrl.push('ChangepassPage');
  }
  listdraft(){
    this.app.getRootNav().push(ListdraftPage);
  }
  showhidden(){
    this.maxlogin = this.maxlogin + 1;
    if(this.maxlogin==5){
        this.show= true;
       
    }
  }
  mode(mo){
    this.api.setmemory('mode',mo);
    this.moda = mo;
    this.events.publish('reload:created',Date.now());
    alert('Anda sekarang sedang dalam mode ' + mo);
  }
  changelogin(){
    this.navCtrl.push(LoginPage, {
      gantiteknisi: 1,
    })
  }
  datateknisi(){
    this.navCtrl.push('ListteknisiPage');
  }
  library(){
    this.navCtrl.push('LibraryPage',{
      admin:1
    });
  }
  libraryteknisi(){
    this.navCtrl.push('LibraryPage',{
      admin:0
    });
  }
  firebase(){
    this.navCtrl.push('FirebasePage');
  }
  lokasi(){
    const option: InAppBrowserOptions = {
      hideurlbar: 'yes',
      toolbar: 'no',
      hardwareback: 'yes',
      useWideViewPort: 'yes',
      location: 'yes',
      hidenavigationbuttons: 'yes'
    }
    /*const browser = this.iab.create('https://forum.marinebusiness.co.id/tracking.php','_self', option);
   
    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "nav { background-color: darkorange; }" });
    });*/
  }
}
