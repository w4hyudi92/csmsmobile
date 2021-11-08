import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { FormwoPage } from './../formwo/formwo';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-storyservice',
  templateUrl: 'storyservice.html',
})
export class StoryservicePage {

  public param:any;
  public arr_token: any;
  arrList=[];
  private isi:any;
  tanggal: string;
  hariini: string;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
  ) {
        this.getData();
        this.tanggal = moment().format("DD/MM/YYYY");
        this.hariini = moment().format("DD/MM/YYYY");  
        //this.isi = navParams.get("isi");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StoryservicePage');
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.getData()
      refresher.complete();
    }, 2000);
  }
  getData() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();

    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'list_ron',
          act: 'history',
          sub: 'filter',
          tanggal: this.tanggal,
          //konsumen_id: this.isi['konsumen_id'],
          usr: profile.nik,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        console.log(data);
          if(data['STATUS'] =="SUKSES") {
            this.arrList =  data['data'];
            loader.dismiss();
          }else{
              this.api.showAlert(data['error']['text']);
              loader.dismiss();
          }
      });
    });
  }
  
  select(item) {
        this.navCtrl.push(FormwoPage, {
        item: item,
        })
  }

  openview(){
    let modal = this.modalCtrl.create('ModalfilterPage',
      {
        content: this,
      });
    modal.onDidDismiss(() => {
      this.getData()
      });
    modal.present();
  }

}
