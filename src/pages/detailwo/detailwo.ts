import { Component, ViewChild  } from '@angular/core';
import { App, LoadingController, IonicPage, NavController, NavParams, ModalController,ActionSheetController,Events   } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import {SignaturePage} from '../signature/signature';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import * as moment from 'moment';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { Transfer, TransferObject } from '@ionic-native/transfer';
import { ListinvoicePage } from '../listinvoice/listinvoice';
import { SelectSearchableComponent } from 'ionic-select-searchable';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/Observable';
import { delay } from 'rxjs/operators';
import { HistoriPendingPage } from '../historipending/historipending';


@IonicPage()
@Component({
  selector: 'page-detailwo',
  templateUrl: 'detailwo.html',
  providers: [ApiProvider]
})
export class DetailwoPage {
  searchTerm: string = '';
  modalDismissData: any;
  public signatureImage : any;
  public ron;
  tipe_servis: string;
  garansi: string;
  keluhan: string;
  alasanTunda: string;
  defect: string;
  perbaikan: string;
  level: string;
  stok_dealer: string;
  modelno: string;
  product_no:string;
  serialno: string;
  tgl_beli:string;
  no_garansi:string;
  note:string;
  keterangan:string;
  keterangan_pending:string;
  keterangan_pending2:string;
  start_repair:boolean = false;
  finish_repair:boolean = false;
  nama_dealer: string;
  cu:boolean;
  photo1: any =  './assets/images/img-not-found.jpg';
  photo2: any =  './assets/images/img-not-found.jpg';
  photo3: any =  './assets/images/img-not-found.jpg';
  photo4: any =  './assets/images/img-not-found.jpg';
  photo1_real = 'img-not-found.jpg';
  photo2_real = 'img-not-found.jpg';
  photo3_real = 'img-not-found.jpg';
  photo4_real = 'img-not-found.jpg';
  waktu_kunjungan:any;
  status: string;
  arrList: any[]=[];
  show: boolean = false;
  public idcust: string;
  public namecust: string;
  public page: any;
  public pending :boolean;

  private itemTipes:any;
  private itemGaransis:any;
  private itemAlasan:any;
  private itemKeluhan:any;
  private itemDefect:any;
  private itemPerbaikan:any;
  private itemLevel:any;
  private itemPart:any;

  private param:any;
  private isi:any;
  private arr_token: any;
  private arr_charge: any = [];
  public base64Image : any;
  public total:number;
  bkerja:number;
  garansi_desc:string;
  alasan_desc:string;
  arr_draft:any = [];
  list_draft:any = [];
  remainingTime:any;
  displayTime:any;
  runTimer:any;
  waktu_ron: any;
  form_no:string = '';
  signa: string = '';
  dsbpending:boolean = false;
  dsbbarcode:boolean = false;
  history:boolean = false;
  moda:string = 'Production';
  arr_limit=[];
  public datanya;
  portsSubscription: any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    public modalCtrl: ModalController,
    private barcodeScanner: BarcodeScanner,
    public modalController:ModalController,
    private photoViewer: PhotoViewer,
    public actionSheetCtrl: ActionSheetController,
    public loadingCtrl: LoadingController,
    private camera: Camera,
    private trf: Transfer,
    private file: File, 
    private filePath: FilePath, 
    private transfer: FileTransfer,
    public events: Events,
    private storage: Storage,
    private app: App ) {
      this.arrList = [];
      events.subscribe('resetdefect:created', eventData => { 
        this.resetdefect();
      });

      this.start_repair=false;
      this.finish_repair = false;
      this.ron = navParams.get("ron");
      this.isi = navParams.get("isi");
      this.history = navParams.get("history");
      this.modelno = this.isi['model'].trim();
      this.product_no = this.isi['itemno'].trim();
      this.serialno = this.isi['produk_serial'];
      this.status = this.isi['status'];
      this.datanya = navParams.get("item");
     
      
      this.storage.get('mode').then(mode => {
        if(mode != null){
          this.moda = mode;
        }
      });

      if(this.status !='Pending' && this.status !='Terima'){
        this.dsbpending = true;
        this.dsbbarcode = true;
        this.pending = false;
      }else{
        this.pending = true;
      }
      let param_image = {
        params: {
          target: '',
          file: '',
          }
      };
      console.log(this.isi['photo1']);
      if(this.isi['photo1'] != null && this.isi['photo1'] !='') {
        param_image['params']['target'] = 'part';
        param_image['params']['file'] = this.isi['photo1'];
        this.api.getImage(param_image).then(data => {
            if(data !="noexist"){
                this.photo1 = data;
                //console.log(this.photo1);
            }
        });
      
      }
      if(this.isi['photo2'] !=null && this.isi['photo2'] !='') {
        param_image['params']['target'] = 'part';
        param_image['params']['file'] = this.isi['photo2'];
        this.api.getImage(param_image).then(data => {
            if(data !="noexist"){
                // this.photo2 = 'data:image/jpeg;base64,'+ data;
                this.photo2 = data
            }
        })
      }
      if(this.isi['photo3'] !=null && this.isi['photo3'] !='') {
        param_image['params']['target'] = 'garansi';
        param_image['params']['file'] = this.isi['photo3'];
        this.api.getImage(param_image).then(data => {
            if(data !="noexist"){
                // this.photo3 = 'data:image/jpeg;base64,'+ data;
                this.photo3 = data;
            }
        });
      }
      if(this.isi['photo4'] !=null && this.isi['photo4'] !='') {
        param_image['params']['target'] = 'garansi';
        param_image['params']['file'] = this.isi['photo4'];
        this.api.getImage(param_image).then(data => {
            if(data !="noexist"){
                // this.photo4 = 'data:image/jpeg;base64,'+ data;
                this.photo4 = data;
            }
        });
      }

      if(this.isi['sign'] != null) {
        
        param_image['params']['target'] = 'signature';
        param_image['params']['file'] = this.isi['sign'];
        this.api.getImage(param_image).then(data => {
          this.signa = 'data:image/jpeg;base64,'+ data;
          // this.signatureImage = 'data:image/jpeg;base64,'+ data;
          this.signatureImage = data;
        });
      }

      this.waktu_kunjungan = navParams.get("waktu_kunjungan");

      //this.storage.remove('draft_ron');
      //console.log(this.signatureImage);
      this.tipe_servis = "502";
      this.garansi = this.isi['status_garansi_id'];
      this.garansi_desc = "IN -In Guarantee";
      this.keterangan = (this.isi['keterangan_teknisi'] == 'undefined' ? '': this.isi['keterangan_teknisi']);
      this.form_no = this.isi['nomor_form'];
      this.note = (this.isi['note'] == 'undefined' ? '' : this.isi['note'] );
      this.no_garansi = this.isi['nomor_kartu_garansi'];
      this.tgl_beli = this.isi['tanggal_pembelian'];
      //this.stok_dealer = "n";
      this.stok_dealer =  this.isi['stok_dealer'];
      this.alasanTunda = "0";
      //this.keluhan = this.isi['keluhan_id'];
      this.keluhan = "0";
      this.defect = "0";
      this.perbaikan = "0";
      this.level = "0";
      this.total = 0;
      this.bkerja =  0;
      this.cu = false;
      
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad DetailwoPage');
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'repair',
        act: 'tipe_service',
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.storage.get('prof').then(profile => {
      this.api.getApi(this.param).then(data => 
      {
        //console.log(data);
          if(data['STATUS'] =="SUKSES") {
            this.itemTipes = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });
    

      this.param['params']['act'] = 'jenis_garansi';
      this.api.getApi(this.param).then(data => 
      {
        //console.log(data['data']);
          if(data['STATUS'] =="SUKSES") {
            this.itemGaransis = data['data'];

            for(var k = 0; k < this.itemGaransis.length; k++){
              if(this.itemGaransis[k]['meta_value'] == this.garansi){
                this.garansi_desc = this.itemGaransis[k]['meta_value_deskripsi'];
              }
            }

          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      this.param['params']['act'] = 'alasan_tertunda';
      this.api.getApi(this.param).then(data => 
      {
        //console.log(data);
          if(data['STATUS'] =="SUKSES") {
            this.itemAlasan = data['data'];
            this.alasan_desc = this.itemAlasan[0]['meta_value_deskripsi'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      this.param['params']['act'] = 'keluhan_repair';
      this.param['params']['model'] = this.isi['prod_categ'];
      this.api.getApi(this.param).then(data => 
      {
        //console.log(data['data']);
          if(data['STATUS'] =="SUKSES") {
            this.itemKeluhan = data['data'];

            if(this.status !='Pending' && this.status !='Terima'){
              this.keluhan =  this.isi['keluhan_id'];
                this.onChangeDefect(this.keluhan);
            }
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      this.param['params']['act'] = 'biaya_perbaikan';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemLevel = data['data'];

            this.getDraft();

          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

    
      this.param['params']['act'] = 'pemakaian_part';
      this.param['params']['perbaikan_id'] = this.isi['perbaikan_id'];
      //Cek jika baru pertama kali dan belum ada session
      if(this.total ==0){
        //this.nothingDraft();
        this.api.getApi(this.param).then(data => 
        {
            if(data['STATUS'] =="SUKSES") {
              this.itemPart = data['data'];
             
              if(this.itemPart != undefined){
                let bef = 0;
                for(var k = 0; k < this.itemPart.length; k++){
                  if(this.garansi=="204"){
                    this.itemPart[k]['disc_part'] = 100;
                    bef = bef + parseFloat(this.itemPart[k]['nilai_biaya']);
                  }else{
                    this.total = this.total + parseFloat(this.itemPart[k]['nilai_biaya']);
                  }
                }
                if(this.garansi=="204"){
                  this.arr_charge['b_part'] = bef;
                  this.arr_charge['disc_part'] = 100;
                  this.arr_charge['net_part'] = 0;
                }
                if(this.history){
                  this.total = parseFloat(this.isi['total']) ;
                }
              }
              this.arr_charge['item_part'] = this.itemPart;
            }else{
              this.api.showAlert(data['MESSAGE']);
            }
        });
      }

      //Cek Waktu Kunjungan
      this.runTimer = false;
      for(var k = 0; k < this.waktu_kunjungan.length; k++){
        if(this.waktu_kunjungan[k]['ron'] == this.ron){
          if(this.waktu_kunjungan[k]['finish_kunjungan'] != ''){
            this.start_repair = true;
            this.finish_repair = true;
            this.waktu_ron = this.waktu_kunjungan[k];
            this.remainingTime = this.waktu_kunjungan[k]['finish_kunjungan'];
            
            if(this.waktu_kunjungan[k]['finish_repair'] == ''){
              this.runTimer = true;
              this.finish_repair = false;
              this.timerTick();
              
            }else{
              this.runTimer = false;
              var ms = moment(this.waktu_kunjungan[k]['finish_kunjungan'],"DD/MM/YYYY HH:mm:ss").diff(moment(this.waktu_kunjungan[k]['start_kunjungan'],"DD/MM/YYYY HH:mm:ss"));
              var d = moment.duration(ms);
              this.displayTime =  (d.hours()<10 ? '0' + d.hours() : d.hours()) + ':' + (d.minutes()<10 ? '0' + d.minutes() : d.minutes()) + ':' + (d.seconds()<10 ? '0' + d.seconds() : d.seconds());
            }
          
          }else{
            this.finish_repair = true;
          }

        }
      }

      if(this.history){
        this.total = parseFloat(this.isi['total']) ;
      }

    });
    this.getDataDealer();
  }

  openModal() {
    const profileModal = this.modalCtrl.create(HistoriPendingPage, { 
        perbaikan_id: this.isi['perbaikan_id']
    });
    profileModal.onDidDismiss(data => {
      console.log(data);
      this.modalDismissData = JSON.stringify(data);
    });
    profileModal.present();
  }

  getDataDealer(){
    this.storage.get('prof').then(profile => {
      this.arr_token = this.api.random();
      this.param = {
          params: {
          mod: 'repair',
          act: 'templatenotanew',
          rand: this.arr_token.rand,
          service_center_id: profile.service_center_id,
          sessid: this.arr_token.sessid,
          token: this.arr_token.token
          }
      };
      this.api.getApi(this.param).then(data => {
          if(data['STATUS'] =="SUKSES") {
            this.arrList = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });
      });
  }

  portChange(event: {
    component: SelectSearchableComponent,
    text: any 
  }) {
    let nama = event.text;
    event.component.startSearch();

    // Close any running subscription.
    if (this.portsSubscription) {
      this.portsSubscription.unsubscribe();
    }

    if (!nama) {
      // Close any running subscription.
      if (this.portsSubscription) {
        this.portsSubscription.unsubscribe();
      }

      event.component.items = this.getCountries(1, 15);
      
      // Enable and start infinite scroll from the beginning.
      this.page = 2;
      event.component.endSearch();
      return;
    }

    this.portsSubscription = this.getPortsAsync().subscribe(ports => {
      // Subscription will be closed when unsubscribed manually.
      if (this.portsSubscription.closed) {
        return;
      }

      event.component.items = this.filterPorts(ports, nama);
      event.component.endSearch();
    });
  }
  

  getPortsAsync(pages?: number, size?: number, timeout = 1000): Observable<any> {
    return new Observable<any>(observer => {
      observer.next(this.getCountries(pages, size));
      observer.complete();
    }).pipe(delay(timeout));
  }

  getCountries(pages?: number, size?: number) {
    let countries = [];
    if (pages && size) {
      countries = this.arrList.slice((pages - 1) * size, ((pages - 1) * size) + size);
    } else {
      countries = this.arrList;
    }

    return countries;
  }
  filterPorts(ports, text: string) {
    return ports.filter(port => {
      return port.NAMECUST.toLowerCase().indexOf(text.toLowerCase()) !== -1 ||
        port.IDCUST.toString().toLowerCase().indexOf(text.toLowerCase()) !== -1;
    });
  }
  getMorePorts(event: { component: SelectSearchableComponent,text: string}) {
    let text = (event.text || '').toLowerCase();

    // There're no more ports - disable infinite scroll.
    // if (this.page > 3) {
    //   event.component.disableInfiniteScroll();
    //   return;
    // }
    this.getPortsAsync(this.page, 15).subscribe(ports => {
      ports = event.component.items.concat(ports);

      if (text) {
        ports = this.filterPorts(ports, text);
      }

      event.component.items = ports;
      event.component.endInfiniteScroll();
      this.page++;
    });
  }

  resetdefect(){
    this.arr_token = this.api.random();
    this.param = {
        params: {
        mod: 'repair',
        act: 'tipe_service',
        rand: this.arr_token.rand,
        sessid: this.arr_token.sessid,
        token: this.arr_token.token
        }
    };
    this.storage.get('prof').then(profile => {
      this.param['params']['act'] = 'keluhan_repair';
      this.param['params']['model'] = this.isi['prod_categ'];
      this.api.getApi(this.param).then(data => 
      {
        //console.log(data['data']);
          if(data['STATUS'] =="SUKSES") {
            this.itemKeluhan = data['data'];
            this.keluhan = '0';
            this.itemDefect = [];
            this.defect = '0';
            this.perbaikan = '0';
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });

      this.level = "0";

      this.param['params']['act'] = 'biaya_perbaikan';
      this.api.getApi(this.param).then(data => 
      {
          if(data['STATUS'] =="SUKSES") {
            this.itemLevel = data['data'];
          }else{
            this.api.showAlert(data['MESSAGE']);
          }
      });
    });
    
  }

  nothingDraft(){
    this.arr_charge['b_part'] = (this.arr_charge['b_part'] != undefined ? this.arr_charge['b_part'] : 0);
    this.arr_charge['disc_part'] = (this.garansi=='204' ? 100 : (this.arr_charge['disc_part'] != undefined ? this.arr_charge['disc_part'] : 0));
    this.arr_charge['net_part'] = (this.arr_charge['net_part'] != undefined ? this.arr_charge['net_part'] : 0);
    
    this.arr_charge['b_angkut'] = 0;
    this.arr_charge['disc_angkut'] = (this.garansi=='204' ? 100 :0);
    this.arr_charge['net_angkut'] = 0;
    let disc_kerj = (this.arr_charge['disc_kerja'] != undefined ? this.arr_charge['disc_kerja'] : 0);
    this.arr_charge['b_kerja'] = this.bkerja;
    this.arr_charge['disc_kerja'] = disc_kerj;
    this.arr_charge['net_kerja'] = (parseInt(disc_kerj) == 100 ? 0 :this.bkerja );

    this.arr_charge['b_lain'] = 0;
    this.arr_charge['disc_lain'] = (this.garansi=='204' ? 100 :0);
    this.arr_charge['net_lain'] = 0;

    this.arr_charge['b_material'] = 0;
    this.arr_charge['disc_material'] = (this.garansi=='204' ? 100 :0);
    this.arr_charge['net_material'] = 0;

    this.arr_charge['ongkos_kunjungan'] = 0;
    this.arr_charge['disc_kunjungan'] = (this.garansi=='204' ? 100 :0);
    this.arr_charge['net_kunjungan'] = 0;

    this.arr_charge['item_part'] = this.itemPart;
    this.arr_charge['total'] = this.total;

    this.arr_charge['matauang'] = '901';
    this.arr_charge['discpartany'] = false;
    this.arr_charge['curr'] = "IDR";
    console.log(this.arr_charge);
  }
  startrepair(){
    this.remainingTime = moment().format("DD/MM/YYYY HH:mm:ss");
    this.runTimer = true;
    this.timerTick();
    this.start_repair = true;
    this.finish_repair = false;

    //Stop waktu kunjungan & start repair
    for(var k = 0; k < this.waktu_kunjungan.length; k++){
      if(this.waktu_kunjungan[k]['ron'] == this.ron){
        this.waktu_kunjungan[k]['finish_kunjungan'] = this.remainingTime;
        this.waktu_kunjungan[k]['start_repair'] = this.remainingTime;
        this.waktu_ron = this.waktu_kunjungan[k];

        this.api.setmemory('waktu_kunjungan',this.waktu_kunjungan );
      }
    }

  }
  stoprepair(){
    this.remainingTime = moment().format("DD/MM/YYYY HH:mm:ss");
    this.runTimer = false;
    this.timerTick();
    this.start_repair = true;
    this.finish_repair = true;

    //Stop repair
    for(var k = 0; k < this.waktu_kunjungan.length; k++){
      if(this.waktu_kunjungan[k]['ron'] == this.ron){
        this.waktu_kunjungan[k]['finish_repair'] = this.remainingTime;
        this.waktu_ron = this.waktu_kunjungan[k];

        this.api.setmemory('waktu_kunjungan',this.waktu_kunjungan );
      }
    }
  }

  timerTick() {
    setTimeout(() => {

     if (!this.runTimer) { return; }

      this.displayTime = this.getSecondsAsDigitalClock();

      if (this.runTimer) {
        this.timerTick();
      }
    }, 1000);
  }

  getSecondsAsDigitalClock() {
    var then = moment().format("DD/MM/YYYY HH:mm:ss");  
    var ms = moment(then,"DD/MM/YYYY HH:mm:ss").diff(moment(this.remainingTime,"DD/MM/YYYY HH:mm:ss"));
    var d = moment.duration(ms);

    return (d.hours()<10 ? '0' + d.hours() : d.hours()) + ':' + (d.minutes()<10 ? '0' + d.minutes() : d.minutes()) + ':' + (d.seconds()<10 ? '0' + d.seconds() : d.seconds());
  }

  getDraft(){
    this.storage.get('draft_ron').then(draft => {
      //console.log(draft);
      //console.log(this.photo1);
      if(draft != null){
        this.list_draft=draft;
        for(var k = 0; k < draft.length; k++){
          if(draft[k]['ron'] == this.ron){
              console.log(draft[k]);
              this.tipe_servis = draft[k]['tipe_servis'];
              this.modelno = draft[k]['modelno'];
              this.product_no = draft[k]['product_no'];
              this.serialno = draft[k]['serialno'];
              this.tgl_beli = draft[k]['tgl_beli'];
              this.stok_dealer = draft[k]['stok_dealer'];
              this.no_garansi = draft[k]['no_garansi'];
              
              this.pending = draft[k]['pending'];
              this.alasanTunda = draft[k]['alasanTunda'];
              this.keluhan = draft[k]['keluhan'];
              this.form_no = (this.form_no=='' ? draft[k]['form_no'] : this.form_no ) ;
              this.cu = draft[k]['cu'];
             
              this.keterangan = draft[k]['keterangan'];
              this.note = draft[k]['note'];
              this.photo1 = (this.photo1 != './assets/images/img-not-found.jpg' ? draft[k]['photo1'] : this.photo1 );
              this.photo2 = (this.photo2 != './assets/images/img-not-found.jpg' ? draft[k]['photo2'] : this.photo2 );
              this.photo3 = (this.photo3 != './assets/images/img-not-found.jpg' ? draft[k]['photo3'] : this.photo3 );
              this.photo4 = (this.photo4 != './assets/images/img-not-found.jpg' ? draft[k]['photo4'] : this.photo4 );
              this.signatureImage = (this.signa=='' ? draft[k]['signatureImage'] : this.signa );
              let tot = draft[k]['total'];
              this.garansi = draft[k]['garansi'];
              let def = draft[k]['defect'];
              let perbaikan = draft[k]['perbaikan'];
              
              this.level = draft[k]['level'];
              this.arr_charge = draft[k]['charge'];
              this.onChangeKeluhan(draft[k]['keluhan']);

              setTimeout(() => {
                this.defect = def;
                this.perbaikan = perbaikan;
                this.total = tot;
              }, 3000);
   
          }
        }
      }
    });
  }

  onChangeKeluhan(kel){
    if(this.itemKeluhan != undefined){
      for(var k = 0; k < this.itemKeluhan.length; k++){
        if(this.itemKeluhan[k]['keluhan_id'] == kel){
         
            this.param['params']['act'] = 'defect_repair';
            this.param['params']['id_keluhan'] = this.itemKeluhan[k]['keluhan_id'];
            this.storage.get('prof').then(profile => {
              this.api.getApi(this.param).then(data => 
              {
                //console.log('onChangeKeluhan');
                  if(data['STATUS'] =="SUKSES") {
                    this.itemDefect = data['data'];
                    this.defect='0';
                    this.perbaikan = '0';
                    if(this.status !='Pending' && this.status !='Terima'){
                      this.defect = this.isi['defect_id'];
                    }
                  }else{
                    this.api.showAlert(data['MESSAGE']);
                  }
              });
            });
        }
      }
    }
  }

  onChangeDefect(def){
    if(this.itemDefect != undefined){
      for(var k = 0; k < this.itemDefect.length; k++){
        if(this.itemDefect[k]['defect_id'] == def){
          
            this.param['params']['act'] = 'perbaikan_repair';
            this.param['params']['id_defect'] = this.itemDefect[k]['defect_id'];
            this.storage.get('prof').then(profile => {
              this.api.getApi(this.param).then(data => 
              {
                  if(data['STATUS'] =="SUKSES") {
                    this.itemPerbaikan = data['data'];
                    if(this.status !='Pending' && this.status !='Terima'){
                      this.perbaikan = this.isi['level_perbaikan_id'];
                      this.level = this.isi['kode_biaya'];
                    }
                  }else{
                    this.api.showAlert(data['MESSAGE']);
                  }
              });
            });
        }
      }
    }
  }

  onChangeBiaya(lev){

    this.total = this.total + (this.isi['biaya_kunjungan'] == null ? 0: parseFloat(this.isi['biaya_kunjungan']));
    for(var k = 0; k < this.itemLevel.length; k++){
      if(this.itemLevel[k]['level_id'] == lev){
        if(this.history){
          this.total = parseFloat(this.isi['total']) ;
        }else{
          if(this.garansi=='204'){
            this.total = this.total + 0 ;
            this.arr_charge['disc_kerja'] = 100;
            this.arr_charge['net_kerja']=0;
          }else{
            this.arr_charge['b_kerja'] =  parseFloat(this.itemLevel[k]['biaya']) ;
            this.arr_charge['disc_kerja'] = 0;
            this.hitungbiaya();
          }
        }
        
        
        this.bkerja = this.itemLevel[k]['biaya'];
        this.arr_charge['b_kerja'] = this.bkerja;
        console.log(this.bkerja);
      }
    }
    
  }

  onChangeGaransi(gar){
    console.log(this.itemGaransis.length);
    if(this.itemGaransis != undefined){
      for(var k = 0; k < this.itemGaransis.length; k++){
        if(this.itemGaransis[k]['meta_value'] == gar){
          this.garansi_desc = this.itemGaransis[k]['meta_value_deskripsi'];
        }
      }
    }
  }
  onChangeAlasan(alasan){
    if(this.itemAlasan != undefined){
      for(var k = 0; k < this.itemAlasan.length; k++){
        if(this.itemAlasan[k]['meta_value'] == alasan){
          this.alasan_desc = this.itemAlasan[k]['meta_value_deskripsi'];
        }
      }
    }
  }

  calculator() {
    console.log('calculator');
    console.log('arr_charge:' + this.arr_charge);
    this.navCtrl.push('BiayaPage',{
      total: this.total,
      kerja: this.bkerja,
      isi: this.isi,
      content: this,
      history: this.history
    });
  }
  partlist() {
    this.navCtrl.push('PartsvcPage', {
      isi: this.isi,
      content: this,
      status: this.status
    });
  }
  cariModel(){
    this.navCtrl.push('ModalitemPage', {
      content: this
    });
  }
 
  submit() {
    let text = this.validate();
    console.log(this.nama_dealer);
    if(text==""){
      this.SetDataDraft();
      this.navCtrl.push('MetodepayPage',{
        isi: this.arr_draft,
        pending: false
      });
    }else{
      this.api.showAlert(text);
    }   
  }
  
  changePending() {
    let text = this.validate();
    if(text==''){
      
      this.SetDataDraft();
      console.log(this.arr_draft);
      this.navCtrl.push('MetodepayPage',{
        isi: this.arr_draft,
        pending: true
      });
    }else{
      this.api.showAlert(text);
    }
    
   
  }

  showHasil(pending) {
    //console.log(pending);
  }

  scanBarcode() {
    this.barcodeScanner.scan().then(barcodeData => {
      if(barcodeData.text != "") {
        this.serialno = barcodeData.text;
      }
      
     }).catch(err => {
         console.log('Error', err);
     });
  }

  openSignatureModel(){
    setTimeout(() => {
        let modal = this.modalController.create(SignaturePage, {
          signatureImage: this,
          ron: this.ron
      });
        modal.present();
    }, 300);

  }

  takePhoto(photos,sourceType:number){
    let options: CameraOptions = {
      quality: 30,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true,
      sourceType: sourceType,
      correctOrientation: true
    }
    this.camera.getPicture(options).then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        if(photos==1) {
            this.photo1 = this.base64Image;
            this.api.pushImage(this.ron + '-part1.jpg', this.base64Image, 'part');
        }else if(photos==2){
            this.photo2 = this.base64Image;
            this.api.pushImage(this.ron + '-part2.jpg', this.base64Image, 'part');
        }else if(photos==3){
          this.photo3 = this.base64Image;
          this.api.pushImage(this.ron + '-garansi1.jpg', this.base64Image, 'garansi');
        }else if(photos==4){
          this.photo4 = this.base64Image;
          this.api.pushImage(this.ron + '-garansi2.jpg', this.base64Image, 'garansi');
        }
        photos.reverse();
        
        
    }, (err) => {
      this.api.showAlert(err);
       console.log(err);
    });
  }
 

  draft(){
    this.SetDataDraft();
   
    let i = 0;
    for(var k = 0; k < this.list_draft.length; k++){
      if(this.list_draft[k]['ron'] == this.ron){
        this.list_draft.splice(k, 1);
        this.list_draft.push(this.arr_draft);
        this.api.setmemory('draft_ron',this.list_draft );
        i=1;
      }
    }
    if(i==0){
      this.list_draft.push(this.arr_draft);
      this.api.setmemory('draft_ron',this.list_draft );
    }
    this.api.showSuccess('Draft Berhasil disimpan..')
    
  }

  SetDataDraft(){
    this.arr_draft['ron'] = this.ron;
    this.arr_draft['log_id'] = this.isi['log_id'];
    this.arr_draft['tipe_servis'] = this.tipe_servis;
    this.arr_draft['modelno'] = this.modelno;
    this.arr_draft['product_no'] = this.product_no;
    this.arr_draft['serialno'] = this.serialno;
    this.arr_draft['tgl_beli'] = this.tgl_beli;
    this.arr_draft['stok_dealer'] = this.stok_dealer;
    this.arr_draft['no_garansi'] = this.no_garansi;
    this.arr_draft['garansi'] = this.garansi;
    this.arr_draft['pending'] = this.pending;
    this.arr_draft['alasanTunda'] = this.alasanTunda;
    this.arr_draft['alasan_desc'] = this.alasan_desc;
    this.arr_draft['keluhan'] = this.keluhan;
    this.arr_draft['keluhan_desc'] = this.isi['keterangan_keluhan'];
    this.arr_draft['defect'] = this.defect;
    this.arr_draft['perbaikan'] = this.perbaikan;
    this.arr_draft['level'] = this.level;
    this.arr_draft['keterangan'] = this.keterangan;
    this.arr_draft['note'] = this.note;
    this.arr_draft['total'] = this.total;
    this.arr_draft['form_no'] = this.form_no;
    this.arr_draft['cu'] = this.cu;
    this.arr_draft['konsumen_id'] = this.isi['konsumen_id'];
    this.arr_draft['nama_konsumen'] = this.isi['nama_konsumen'];
    this.arr_draft['kota'] = this.isi['kota'];
    this.arr_draft['alamat'] = this.isi['alamat'];

    this.arr_draft['photo1'] = this.photo1;
    this.arr_draft['photo2'] = this.photo2;
    this.arr_draft['photo3'] = this.photo3;
    this.arr_draft['photo4'] = this.photo4;
    this.arr_draft['signatureImage'] = this.signatureImage;
    
    if(this.arr_charge.b_angkut == undefined){
        this.nothingDraft();
    }

    this.arr_draft['charge'] = this.arr_charge;
    this.arr_draft['perbaikan_id'] = this.isi['perbaikan_id'];
    
    this.arr_draft['waktu'] = this.waktu_ron;
    this.arr_draft['status'] = this.isi['status'];
    this.arr_draft['nomor_ron'] = this.isi['nomor_ron'];
    this.arr_draft['keterangan_keluhan'] = this.isi['keterangan_keluhan'];
    this.arr_draft['model'] = this.isi['model'];
    this.arr_draft['prod_categ'] = this.isi['prod_categ'];
    this.arr_draft['itemdesc'] = this.isi['itemdesc'];
    this.arr_draft['status_garansi'] = this.isi['status_garansi'];
    this.arr_draft['jadwal_tanggal'] = this.isi['jadwal_tanggal'];
    this.arr_draft['jadwal_waktu'] = this.isi['jadwal_waktu'];
    this.arr_draft['telepon'] = this.isi['telepon'];
    this.arr_draft['itemno'] = this.isi['itemno'];
    this.arr_draft['mode'] = this.moda;
    this.arr_draft['email'] = this.isi['email'];
    this.arr_draft['nama_dealer'] = this.nama_dealer;

    console.log(this.arr_draft);
    
  }

  presentActionSheet(photos) {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih Foto',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon:'camera',
          handler: () => {
            if(this.status !='Pending' && this.status !='Terima'){
                this.api.showAlert('Ron tidak bisa diubah lagi..');
                return false;            
            }
            this.takePhoto(photos,1);
          }
        },{
          text: 'Galeri Foto',
          icon:'images',
          handler: () => {
            if(this.status !='Pending' && this.status !='Terima'){
                this.api.showAlert('Ron tidak bisa diubah lagi..');
                return false;            
            }
            this.takePhoto(photos,0);
          }
        },{
            text: 'Preview',
            icon:'eye',
            handler: () => {
            this.viewPhoto(photos);
            }
        },{
          text: 'Batal',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  viewPhoto(photos){
    if(photos==1) {
        this.photoViewer.show(this.photo1);
    }else if(photos==2){
        this.photoViewer.show(this.photo2);
    }else if(photos==3){
      this.photoViewer.show(this.photo3);
    }else if(photos==4){
      this.photoViewer.show(this.photo4);
    }
   
  }

  refreshdata(iparams){
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.arr_token = this.api.random();
    this.storage.get('prof').then(profile => {
      this.param['params']['model'] = this.isi['prod_categ'];
      if(iparams == 1) {
        this.param['params']['act'] = 'keluhan_repair';
        this.api.getApi(this.param).then(data => 
        {
            if(data['STATUS'] =="SUKSES") {
              this.itemKeluhan = data['data'];
              this.keluhan = '0';
              this.itemDefect = [];
              this.defect = '0';
              this.perbaikan = '0';
              loader.dismiss();
            }else{
              this.api.showAlert(data['MESSAGE']);
              loader.dismiss();
            }
        });
      }else if(iparams == 2) {
        if(this.itemKeluhan != undefined){
          this.itemDefect = [];
          if(this.keluhan=='0') loader.dismiss();
          for(var k = 0; k < this.itemKeluhan.length; k++){
            if(this.itemKeluhan[k]['keluhan_id'] == this.keluhan){
                this.param['params']['act'] = 'defect_repair';
                this.param['params']['id_keluhan'] = this.itemKeluhan[k]['keluhan_id'];
                this.api.getApi(this.param).then(data => 
                {
                    if(data['STATUS'] =="SUKSES") {
                      this.itemDefect = data['data'];
                      this.defect='0';
                      this.perbaikan = '0';
                      loader.dismiss();
                    }else{
                      this.api.showAlert(data['MESSAGE']);
                      loader.dismiss();
                    }
                });
            }
          }
        }else{
          loader.dismiss();
        }
      }else if(iparams == 3) {
        if(this.itemDefect != undefined){
          if(this.defect=='0') loader.dismiss();
          for(var k = 0; k < this.itemDefect.length; k++){
            if(this.itemDefect[k]['defect_id'] == this.defect){
                this.itemPerbaikan = [];
                this.param['params']['act'] = 'perbaikan_repair';
                this.param['params']['id_defect'] = this.itemDefect[k]['defect_id'];
                this.api.getApi(this.param).then(data => 
                {
                    if(data['STATUS'] =="SUKSES") {
                      this.perbaikan = '0';
                      this.itemPerbaikan = data['data'];
                      loader.dismiss();
                    }else{
                      this.api.showAlert(data['MESSAGE']);
                      loader.dismiss();
                    }
                });
            }
          }
        }else{
          loader.dismiss();
        }
      }else if(iparams == 4) {
        this.param['params']['act'] = 'biaya_perbaikan';
        this.itemLevel = [];
        this.level = '0';
        this.api.getApi(this.param).then(data => 
        {
            if(data['STATUS'] =="SUKSES") {
              this.itemLevel = data['data'];
              loader.dismiss();
            }else{
              this.api.showAlert(data['MESSAGE']);
              loader.dismiss();
            }
        });
      }
    });
    
  }

  validate(){
 
    var text ='';
    if(this.modelno.trim()==''){
      text +='- Model tidak boleh kosong<br>';
    }
    /*if(this.nama_dealer == undefined){
      text +='- Nama Dealer tidak boleh kosong<br>';
    }*/
    if (this.product_no.trim()=='') {
      text +='- Produk No tidak boleh kosong<br>';
    }
    if(this.serialno.trim()=='' && this.pending==false){
      text +='- Serial tidak boleh kosong<br>';
    }
    if(this.form_no==null && this.pending==false){
      text +='- No Form tidak boleh kosong<br>';
    }
    // if(this.alasanTunda == '0'){
    //   text +='Alasan Pending Harus dipilih!';
    // }
    if(this.tgl_beli== undefined ){
      text +='- Tanggal Pembelian tidak boleh kosong<br>';
    }
    if(this.start_repair==false && this.finish_repair==true  ){
      text +='- Waktu Start belum di nyalakan<br>.';
    }
    if(this.finish_repair==false && this.start_repair==true ){
      text +='- Waktu Stop belum di berhentikan.<br>';
    }
    if(this.pending==false && this.keluhan== "0" ){
      text +='- Kode Keluhan belum dipilih.<br>';
    }
    if(this.pending==false && this.defect== "0" ){
      text +='- Kode Defect belum dipilih.<br>';
    }
    if(this.pending==false && this.perbaikan== "0" ){
      text +='- Kode Perbaikan belum dipilih.<br>';
    }
    if(this.pending==false && this.level== "0" ){
      text +='- Level Perbaikan belum dipilih.<br>';
    }
    if(this.pending==false && this.signatureImage== undefined ){
      text +='- Tanda tangan customer diwajibkan..<br>';
    }
    // if(this.garansi== "204" && (this.photo3== './assets/images/img-not-found.jpg' && this.photo4== './assets/images/img-not-found.jpg') ){
    //   text +='- Anda harus melampirkan foto garansi.';
    // }
    if(this.garansi== "204" && this.no_garansi.trim()== '' && this.pending==false ){
      text +='- Anda harus melampirkan No garansi.<br>';
    }
    return text;
  }

  hitungbiaya(){
    let bpart = 0;
    let npart = 0;
    for(var k = 0; k < this.itemPart.length; k++){
            bpart = bpart + (parseFloat(this.itemPart[k]['kuantitas']) * parseFloat(this.itemPart[k]['nilai_biaya']));
            npart = bpart;
    }
    
    this.arr_charge['part'] = npart;
    this.arr_charge['angkut'] = (this.arr_charge['net_angkut']== undefined ? 0 : this.arr_charge['net_angkut']);
    this.arr_charge['kerja'] = (this.arr_charge['net_kerja']== undefined ?  (this.arr_charge['b_kerja']== undefined ? 0 : this.arr_charge['b_kerja']) : this.arr_charge['net_kerja']);
    this.arr_charge['kunjungan'] = (this.arr_charge['net_kunjungan']== undefined ? 0 : this.arr_charge['net_kunjungan']);
    this.arr_charge['lain'] = (this.arr_charge['net_lain']== undefined ? 0 : this.arr_charge['net_lain']);
    this.arr_charge['material'] = (this.arr_charge['net_material']== undefined ? 0 : this.arr_charge['net_material']);

    this.total = parseFloat(this.arr_charge['kerja']) + this.arr_charge['angkut'] + this.arr_charge['lain'] + this.arr_charge['part'] + this.arr_charge['material'] + this.arr_charge['kunjungan'];
    console.log(this.arr_charge);
  }
}
