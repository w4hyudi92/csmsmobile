import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { ListkonsumenPage } from '../listkonsumen/listkonsumen';
import { HistoryksPage } from '../historyks/historyks';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
/**
 * Generated class for the MenuksPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-menuks',
  templateUrl: 'menuks.html',
})
export class MenuksPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public api: ApiProvider,
    private alertCtrl: AlertController,
    private iab: InAppBrowser) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenuksPage');
  }

  historyks(){
    //this.api.showAlert('Sedang dalam pengembangan');
    this.navCtrl.push('HistoryksPage');
  }
  listks(){
    this.navCtrl.push('ListksPage');
  }
  buatdaftar(){
    this.navCtrl.push(ListkonsumenPage);
    //this.navCtrl.push('MetodepayksPage');
  }

  setorks(){
    const option: InAppBrowserOptions = {
      hideurlbar: 'yes',
      toolbar: 'no',
      hardwareback: 'no',
      useWideViewPort: 'no',
      location: 'yes',
      hidenavigationbuttons: 'yes',
      hidden : 'no', //Or  'yes'
      clearcache : 'yes',
      clearsessioncache : 'yes',
      zoom : 'no',//Android only ,shows browser zoom controls
      mediaPlaybackRequiresUserAction : 'no',
      shouldPauseOnSuspend : 'no', //Android only
    }
    const browser = this.iab.create('http://103.86.154.244/apimobile/midtrans/charge/index.php','_self', option);

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "nav { background-color: darkorange; }" });
      browser.executeScript({
        code: 'document.cookie = document.getElementsByClassName("pnc_select")[0].dataset["part"].substring(5,50);'
      }).then((cookie)=>{ 
        browser.hide();
        let alerts = this.alertCtrl.create({
          title: 'Confirm Filter',
          message: 'Silahkan lakukan pembayaran sesuai dengan nomor pembayaran dan metode pembayaran yang anda pilih. Terima kasih..',
          buttons: [
            {
              text: 'Selesai',
              handler: () => {
                browser.hide();
              }
            }
          ]
        });
        alerts.present();
      });
    });
  }

}
