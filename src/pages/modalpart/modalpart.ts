import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';

@IonicPage()
@Component({
  selector: 'page-modalpart',
  templateUrl: 'modalpart.html',
})
export class ModalpartPage {
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
  tipe: string = "391";
  alasan: string = "396";

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController,
    public api: ApiProvider,
    public loadingCtrl: LoadingController,
    private storage: Storage) {
      this.no=1;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalpartPage');
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
          act: 'list_part_avail',
          usr: profile.nik,
          service_center_id: profile.service_center_id,
          rand: this.arr_token.rand,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token,
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
  dismiss() {
    this.viewCtrl.dismiss();
  }
  itemSelected(itm){
    this.arrModel = [];
    this.qty = parseInt(itm["qty_avail"]);
    this.arrModel.push(itm);
    this.task = true;
  }
  tambahkan(itm){
    console.log(itm);
    if(this.qty > itm['qty_avail']){
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
   
    // if(total+(itm['unitprice_disc']*this.qty)> this.navParams.get('limit') ){
    //   this.api.showAlert('Total tidak boleh melebihi limit..');
    //   return;
    // }


    let arrs = [];
    arrs['item_desc'] = itm['item_desc'];
    arrs['itemno'] = itm['itemno'];
    arrs['inventory_id'] = itm['inventory_id'];
    arrs['qty'] = this.qty;
    arrs['tipe'] = this.tipe;
    arrs['tipe_name'] = (this.tipe == '391' ? 'Good Part' : 'Defect Part');
    arrs['alasan'] = this.alasan;
    arrs['alasan_name'] = (this.alasan == '396' ? 'New Part Return' : 'Parts broken');
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
