import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { FormwoPage } from './../formwo/formwo';

@IonicPage()
@Component({
  selector: 'page-listdraft',
  templateUrl: 'listdraft.html',
})
export class ListdraftPage {

  public param:any;
  public arr_token: any;
  arrList:any = [];
  private isi:any;
  show: boolean = false;
  moda:string = 'Production';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage,
    public loadingCtrl: LoadingController,
  ) {
      this.storage.get('mode').then(mode => {
        if(mode != null){
          this.moda = mode;
          this.presentLoading();
        }
      });
        
        //this.isi = navParams.get("isi");
        
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ListDraft');
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);

    setTimeout(() => {
      this.getData()
      refresher.complete();
    }, 2000);
  }
  getData() {
    this.arrList=[];
    this.storage.get('draft_ron').then(draft => {
        if(draft != undefined ){
          console.log(draft);
          for(var k = 0; k < draft.length; k++){
            if(draft[k]['mode'] == this.moda){
              this.arrList.push(draft[k]);
              this.show= true;
            }
          }
          //this.arrList =  draft;
          
        }
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
  
  select(item) {
    console.log(item);
        this.navCtrl.push(FormwoPage, {
        item: item,
        })
  }
  cleardraft(){
    if(confirm("Data akan dihapus keseluruhan, yakin ??")){
      this.storage.remove('draft_ron');
      this.arrList = [];
      this.show= false;
    }
    
  }
}
