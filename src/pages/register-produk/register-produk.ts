import { Component } from '@angular/core';
import { LoadingController,ModalController, AlertController ,IonicPage, NavController, NavParams , ActionSheetController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { HomePage } from '../home/home';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { DomSanitizer } from '@angular/platform-browser';

@IonicPage()
@Component({
  selector: 'page-register-produk',
  templateUrl: 'register-produk.html',
})
export class RegisterProdukPage {

  public base64Image : any =  './assets/images/img-not-found.jpg';
  profile=[];
  
  public myForm: FormGroup;
  values:Array<string> = [];
  labels:Array<string> = [];
  valids:Array<string> = [];
  validatePar:Array<string>=[];
  public param:any;
  public homeColor : String;
  display: String;
  label_klaim_cashback_pelanggan_terhormat: String;
  label_klaim_cashback_silahkan_lengkapi: String;
  label_faktur_harus_difoto: string;
  label_konten_syarat_dan_ketentuan: string;
  label_foto_faktur: string;
  label_tempat_pembelian: string;
  label_tanggal_pembelian: string;
  label_data_pembelian:string;
  label_no_seri_produk : string;
  konten_metode_klaim: any;
  judul_notifikasi:string;
  label_klaim_cashback_metode_pembayaran:string;
  judul:string;
  judul_konfirmasi:string;
  konfirmasi_kirim_registrasi_garansi:string;

  metodeKlaim:any;
  kontenMetodeKlaim:any;
  mk:string;
  language:any;
  tempat_beli: string;
  tgl_beli: any;

  arr_bulan = new Array("Januari","Februari","Maret","April", "Mei","Juni","Juli","Agustus","September","Oktober","November","Desember");
  data = {
    projects: [
      {
        projectName: "",
      }
    ]
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,private storage: Storage,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,
    private barcodeScanner: BarcodeScanner,
    private camera: Camera,
    public api: ApiProvider,
    private sanitizer: DomSanitizer,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController) {
      this.display = 'none';
      this.mk = '0';
      this.konten_metode_klaim = '';
      this.myForm = this.formBuilder.group({
        projects: this.formBuilder.array([])
      })
      this.setCompanies();
      storage.get('login').then(getData => {
        if (getData) {
          this.profile = getData;
          //this.navCtrl.setRoot(MenuPage);
        }else{
          this.showAlert();
        }
    });
  }

  standart_validation(){
    this.validatePar["tempat"]= this.tempat_beli;
    this.validatePar["tgl_beli"]= this.tgl_beli;
  }

  ionViewDidLoad() {
    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    loader.present();
    this.loadMetode();
    loader.dismiss();
    
  }

  loadMetode(){

  }
  
  showAlert() {
    const alert = this.alertCtrl.create({
      title: 'Login Authentication',
      subTitle: 'Please login for next step.',
      buttons: [
        {
          text: 'OK',
          handler: data => {
            this.navCtrl.setRoot(HomePage);
          }
        }
      ]
    });
    alert.present();
  }

  presentActionSheet() {
    const actionSheet = this.actionSheetCtrl.create({
      title: 'Pilih Foto',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon:'camera',
          handler: () => {
            this.takePhoto(1);
          }
        },{
          text: 'Galeri Foto',
          icon:'images',
          handler: () => {
            this.takePhoto(0);
          }
        },{
            text: 'Preview',
            icon:'eye',
            handler: () => {

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

  takePhoto(sourceType:number){
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
        
    }, (err) => {
       console.log(err);
    });
  }
  addNewProject() {
    let control = <FormArray>this.myForm.controls.projects;
    control.push(
      this.formBuilder.group({
          projectName: ['']
      })
    )
  }
  deleteProject(index) {
    let control = <FormArray>this.myForm.controls.projects;
    control.removeAt(index);
    this.labels.splice(index,1);
    this.values.splice(index,1);
  }

  setCompanies() {
    let control = <FormArray>this.myForm.controls.projects;
    this.data.projects.forEach(x => {
      control.push(this.formBuilder.group({ 
        projectName: x.projectName 
      }))
    })
  }

  valChange(value:string, index:number):void{
    this.display = 'block';
    this.values[index] = value;
    this.param = {
        params: {
        ws: 'cek_data_registrasiproduk',
        sn: value,
        }
    };

    this.api.getApi(this.param).then(data => 
    {
      this.labels[index] = '';
      if(data['error'] == undefined) {
        if(data['item'] != ''){
          if(data['item'] == "duplikasi" ) {
            this.labels[index] = 'Produk sudah diregistrasikan!';
          }else{
            this.labels[index] = data['item'];
            this.valids[index] = '1';
          }
        }else{
          this.labels[index] ='Produk tidak dikenal. Scan Ulang!';
        }
      }else{
          alert(JSON.stringify(data['error']));
      }
    });
  }

  scanBarcode(index) {
    this.barcodeScanner.scan().then(barcodeData => {
      if(barcodeData.text != "") {
        this.values[index]  = barcodeData.text;
        this.valChange(barcodeData.text,index);
      }
      
     }).catch(err => {
         console.log('Error', err);
     });
  }

  onChangeMetode(val){
    this.mk = val;
    if(parseInt(val)>0){
      this.konten_metode_klaim =  this.kontenMetodeKlaim[val].replace(/#no_ponsel#/,this.profile['hp']);
    }else{
      this.konten_metode_klaim = '';
    }
  }

  subvalid(text){
    if(this.tempat_beli=='' || this.tempat_beli == undefined){
      text += "- " + this.label_tempat_pembelian + ' ' + this.language['id']['validasi'].required + '<br>';
    }
    if(this.tgl_beli=='' || this.tgl_beli == undefined){
      text += "- " + this.label_tanggal_pembelian + ' '+ this.language['id']['validasi'].required +'<br>';
    }
    // if(this.base64Image == "./assets/images/img-not-found.jpg"){
    //   text += "- " + this.label_foto_faktur + ' '+ this.language['id']['validasi'].required +'<br>';
    // }
    if(this.mk=="0"){
      text += "- " + this.label_klaim_cashback_metode_pembayaran + ' '+ this.language['id']['validasi'].combo +'<br>';
    }
    for(var k = 0; k < this.values.length; k++){
      if(this.values[k]=='' || this.values[k] == undefined){
        text += "- " + this.label_no_seri_produk + ' ' + (k+1) + ' '+ this.language['id']['validasi'].required +'<br>';
      }else if(this.valids[k] !='1'){
        text += "- " + this.label_no_seri_produk + ' '+ this.language['id']['validasi'].notvalid +'<br>';
      }
    }
    return text;
  }

  showConfirm(par_metode) {
    
    this.param = {
      params: {
        ws: 'registrasi_garansi_simpan',
        sel_metode_klaim: this.mk,
        hd_tanggal_pembelian: this.tgl_beli,
        t_tempat_pembelian: this.tempat_beli,
        konsumen_id:'19894'
      }
    };

    for(var l = 0; l < par_metode.length; l++){
      let obj = document.getElementById(par_metode[l]);
      this.param['params'][par_metode[l]] = obj['value'];
    }
    //debugger;
    
    
    const confirm = this.alertCtrl.create({
      message: this.konfirmasi_kirim_registrasi_garansi,
      title: this.judul_konfirmasi,
      buttons: [
        {
          text: 'OK',
          handler: () => {
            

          // this.param['params']['metode_klaim'] = this.mk;
  
          // this.api.getApi(this.param).then(data => 
          // {
          //   if(data['error'] == undefined) {

          //   }else{
                
          //   }
          // });
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            console.log('Agree clicked');
          }
        }
      ]
    });
    confirm.present();
  }
}
