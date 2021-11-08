import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { HistorisetorPage } from '../historisetor/historisetor';

@IonicPage()
@Component({
  selector: 'page-menusetor',
  templateUrl: 'menusetor.html',
})
export class MenusetorPage {
  PluginName: any;
  
  constructor(
    public navCtrl: NavController,
    public api: ApiProvider,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,) {
  }

  options : InAppBrowserOptions = {
    location : 'yes',//Or 'no'
    hidden : 'no', //Or  'yes'
    clearcache : 'yes',
    clearsessioncache : 'yes',
    zoom : 'no',//Android only ,shows browser zoom controls
    hardwareback : 'yes',
    mediaPlaybackRequiresUserAction : 'no',
    shouldPauseOnSuspend : 'no', //Android only
  };

  ionViewDidLoad() {
    console.log('ionViewDidLoad MenusetorPage');
  }

  /*infokonsumen(){
    this.api.showAlert('Sedang dalam pengembangan');
  }*/
  openviewsetor(){
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
    // browser.on('exit').subscribe(() => {
    //   alert("Gak boleh close!!!");
    // }, err => {
    //   alert("Ada error Bambang!!!");
    // });
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

  historilist(){
    // this.api.showAlert('FTU Sedang dalam pengembangan..');
    this.navCtrl.push(HistorisetorPage);
  }

}