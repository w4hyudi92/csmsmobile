import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the TabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html',
})
export class TabsPage {

  tab1Root: any = 'NotifikasiPage';
  tab2Root: any = 'ProfilePage';
  specialRoot: any = 'SpecialPage';
  homeRoot: any = HomePage;
  myIndex: number;
  tab1BadgeCount : number = 0;
  private param:any;
  private arr_token: any;

  constructor(public navCtrl: NavController,private storage: Storage, public navParams: NavParams,
    public api: ApiProvider,
    public events: Events,
    ) 
  {
    events.subscribe('notifikasi:created', eventData => { 
      this.refresh();
    });

    if(navParams.data.tabIndex != undefined){
      this.myIndex =  navParams.data.tabIndex;
    }else{
      this.myIndex =  0;
    }
  }

  ionViewDidLoad() {
    //this.refresh();
  }

  ionViewWillEnter(){
    this.refresh();
  }

  refresh(){
    this.arr_token = this.api.random();
    
    this.storage.get('prof').then(profile => {
      this.param = {
        params: {
        mod: 'notifikasi',
        act: 'koleksi',
        usr: profile.nik,
        service_center_id: profile.service_center_id,
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
      };

      this.api.getApi(this.param).then(data => 
      {
        if(data['STATUS'] =="SUKSES") {
          let i=0;
          if( data['data']!=undefined){
            for(var k = 0; k < data['data'].length; k++){
              if(data['data'][k]['baca'] == 0){
                i = i+1;
              }
            }
            this.tab1BadgeCount = i;
          }
          
     
        }else{
          this.api.showAlert(data['error']['error']);
        }
      });
      
    });
  }
}
