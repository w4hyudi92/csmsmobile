import { Component } from '@angular/core';
import { AlertController ,LoadingController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { retry } from 'rxjs/operator/retry';


@IonicPage()
@Component({
  selector: 'page-modelinfo',
  templateUrl: 'modelinfo.html',
})
export class ModelinfoPage {
  public itemno:string;
  public param:any;
  public arr_token: any;
  arrList=[];
  arrModel=[];
  isfiltered: boolean ;
  filter: string;
  no:number;
  show: boolean = false;
  task: boolean = false;
  qty: number = 1;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    private iab: InAppBrowser,
    private alertCtrl: AlertController,
    private storage: Storage) {
      this.no=1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModelinfoPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

  openview(){
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
    const browser = this.iab.create('https://air.modena.co.id/ecatalog/','_self', option);

    browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "nav { background-color: darkorange; }" });
      browser.executeScript({
        code: 'document.cookie = document.getElementsByClassName("pnc_select")[0].dataset["part"].substring(5,50);'
      }).then((cookie)=>{ 
        browser.hide();
        let alerts = this.alertCtrl.create({
          title: 'Confirm Filter',
          message: '',
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

  pilih(){
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.storage.get('prof').then(profile => {
      console.log(profile);
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'part',
          act: 'inventori_part',
          usr: profile.nik,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token,
          filter: this.filter,
          no: this.no
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        console.log(data);
          if(data['STATUS'] =="SUKSES") {
           if(data['data'] == undefined) {
            this.arrList = [];
            this.show= false;
           }else{
            this.arrList = data['data'];
            this.show= true;
           }
           loader.dismiss();
          }else{
              this.api.showAlert(data['MESSAGE']);
              loader.dismiss();
          }
      });
    });
  }
  itemSelected(itm){
    this.arrModel = [];
    //console.log(itm);
    this.arrModel.push(itm);
    this.task = true;
  }
  tambahkan(itm){
    console.log(itm);
    if(this.qty > parseInt(itm['qty_avail'])){
      this.api.showAlert('Qty tidak boleh lebih besar dari Qty Available');
      return;
    }
    if(this.qty <= 0){
      this.api.showAlert('Qty tidak boleh lebih kecil dari Nol');
      return;
    }
    for(var k = 0; k < this.navParams.get('content').arrData.length; k++){
      if(this.navParams.get('content').arrData[k]['itemno'] == itm['itemno']){
        this.api.showAlert('Item sudah digunakan.. SIlahkan pilih item lain.');
        return;
      }
    }
    //debugger;
    let total = this.hitungtotal();
   
    if(total+(itm['unitprice_disc']*this.qty)> this.navParams.get('limit') ){
      this.api.showAlert('Total tidak boleh melebihi limit..');
      return;
    }


    let arrs = [];
    arrs['item_desc'] = itm['item_desc'];
    arrs['itemno'] = itm['itemno'];
    arrs['qty'] = this.qty;
    arrs['unitprice_disc'] = itm['unitprice_disc'];

    this.navParams.get('content').total = total + (itm['unitprice_disc']*this.qty);
    this.navParams.get('content').arrData.push(arrs);
    this.navParams.get('content').show = true;
   
    this.viewCtrl.dismiss();
  }
  hitungtotal(){
    let tot:number = 0
    for(var k = 0; k < this.navParams.get('content').arrData.length; k++){
      tot = tot + ( this.navParams.get('content').arrData[k]['unitprice_disc'] * this.navParams.get('content').arrData[k]['qty'])
    }
    return tot;
  }
}
