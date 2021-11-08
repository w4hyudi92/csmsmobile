import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the MypartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mypart',
  templateUrl: 'mypart.html',
  providers: [ApiProvider]
})
export class MypartPage {

  public param:any;
  public arr_token: any;
  arrList=[];
  arrListavail=[];
  arrListempty=[];
  show: boolean = false ;
  pet: string = "puppies";
  all:number = 0;avail:number = 0; kosong: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage,) {
      
  }

  ionViewDidLoad() {
    this.presentLoading();
    console.log('ionViewDidLoad MypartPage');
    //this.getData(); 
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.getData()
      refresher.complete();
    }, 2000);
  }

  getData() {
    this.storage.get('prof').then(profile => {
      console.log(profile);
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'part',
          act: 'list_part',
          usr: profile.nik,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      var filtered = [];
      this.api.getApi(this.param).then(data => 
      {
        if(data['data'] == undefined) {
          this.arrList = [];
          this.arrListavail = [];
          this.show= false;
        }else{
          this.arrList = data['data'];
         
          for(var k = 0; k < this.arrList.length; k++){
            if(parseInt(this.arrList[k]['qty_avail']) > 0){
              this.arrListavail.push(this.arrList[k]);
            }
            if(parseInt(this.arrList[k]['qty_avail']) == 0){
              this.arrListempty.push(this.arrList[k]);
            }
          }
          this.all = this.arrList.length;
          this.avail = this.arrListavail.length;
          this.kosong = this.arrListempty.length;
          this.show= true;
        }
          
      });
    });
  }


  presentLoading() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.getData();
    loader.dismiss();
  }
}
