import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { ModalHistoriPending } from '../modalhistoripending/modalhistoripending';

/**
 * Generated class for the NewModalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-historipending',
  templateUrl: 'historipending.html',
  providers: [ApiProvider]
})
export class HistoriPendingPage {
  public arr_token: any;
  public param:any;
  private pid:any;
  modalDismissData: any;

  show: boolean = false;
  userId: number;
  arrPending = [];

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    private storage: Storage,
    public api: ApiProvider,
    private modalCtrl:ModalController
  ) {
    this.pid = navParams.get("perbaikan_id");
  }

  ionViewDidLoad() {
    this.getData();
  }

  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server......",
    });
    loader.present();
    this.getData();
    loader.dismiss();
  }

  getData() {
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'historikunjungan_pending',
          act: 'historikunjunganpending',
          perbaikan_id: this.pid,
          usr: profile.nik,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          if(data['data'] == undefined) {
            this.arrPending = [];
            this.show= false;
          }else{
            this.arrPending = data['data'];
            this.show= true;
          }
        }else{
            this.api.showAlert(data['error']['error']);
            this.arrPending = [];
            this.show= false;
        }
      });
    });
  }

  seeDetail(itm) {
    this.navCtrl.push(ModalHistoriPending, {
      item: itm,
    })
  }

  dismissModal() {
    let data = { 'foo': 'bar' };
    this.viewCtrl.dismiss(data);
  }


}