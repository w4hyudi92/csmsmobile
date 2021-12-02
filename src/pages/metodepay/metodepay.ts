import { Component } from '@angular/core';
import { LoadingController, IonicPage, NavController, NavParams, ViewController,Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { ListwoPage } from './../listwo/listwo';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';


@IonicPage()
@Component({
  selector: 'page-metodepay',
  templateUrl: 'metodepay.html',
  providers: [ApiProvider]
})
export class MetodepayPage {
  public par;
  total:number;
  status:string;
  private param:any;
  private arr_token: any;
  text_berhasil:string;
  nama_teknisi:string;
  pic1:string;
  pic2:string;
  pic3:string;
  pic4:string;
  sign:string;
  metodepembayaran: string;
  biayaTotal: number;
  cash: string;
  wallet: string;
  hasil: number;
  hasilDiskon: number;
  ketdiskon: string;
  myDate: any;
  referensibayar: string;
  arrpart:any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public api: ApiProvider,
    private storage: Storage, 
    private viewCtrl: ViewController,
    private file: File, 
    public loadingCtrl: LoadingController,
    public events: Events,
    private transfer: FileTransfer ,
    private filePath: FilePath) {
        
        this.par = navParams.get("isi");
        this.status = navParams.get("pending");
        // console.log(this.par);
        this.biayaTotal= 0;
        this.myDate = new Date();

        // console.log(this.par);

        this.storage.get('prof').then(profile => {
            this.nama_teknisi = profile.nama_lengkap;
            let arr_charge = [];
            let arr_part = [];
            let arr_waktu = [];

            arr_waktu.push({
                start_kunjungan: this.par.waktu.start_kunjungan,
                finish_kunjungan: this.par.waktu.finish_kunjungan,
                start_repair: this.par.waktu.start_repair,
                finish_repair: this.par.waktu.finish_repair,
                log_id: this.par.waktu.log_id
            });
            arr_charge.push({
                b_angkut: this.par.charge.b_angkut,
                b_kerja: this.par.charge.b_kerja,
                b_lain: this.par.charge.b_lain,
                b_material: this.par.charge.b_material,
                b_part: this.par.charge.b_part,
                curr: this.par.charge.curr,
                disc_angkut: this.par.charge.disc_angkut,
                disc_kerja: this.par.charge.disc_kerja,
                disc_lain: this.par.charge.disc_lain,
                disc_material: this.par.charge.disc_material,
                disc_part: this.par.charge.disc_part,
                disc_kunjungan: this.par.charge.disc_kunjungan,
                discpartany: this.par.charge.discpartany,

                matauang: this.par.charge.matauang,
                net_angkut: this.par.charge.net_angkut,
                net_kerja: this.par.charge.net_kerja,
                net_lain: this.par.charge.net_lain,
                net_material: this.par.charge.net_material,
                net_part: this.par.charge.net_part,
                net_kunjungan: this.par.charge.net_kunjungan,
                ongkos_kunjungan: this.par.charge.ongkos_kunjungan,
                total: this.par.charge.total
            });
            if(this.par.charge.item_part != undefined){
                for(var k = 0; k < this.par.charge.item_part.length; k++){
                    arr_part.push({
                        biaya_id: this.par.charge.item_part[k]['biaya_id'],
                        disc_part: this.par.charge.item_part[k]['disc_part'],
                        diskon: this.par.charge.item_part[k]['diskon'],
                        fmtitemno: this.par.charge.item_part[k]['fmtitemno'],
                        garansi: this.par.charge.item_part[k]['garansi'],
                        inventory_id: this.par.charge.item_part[k]['inventory_id'],
                        item_desc: this.par.charge.item_part[k]['item_desc'],
                        kategori: this.par.charge.item_part[k]['kategori'],
                        kode_part: this.par.charge.item_part[k]['kode_part'],
                        konsumen_id: this.par.charge.item_part[k]['konsumen_id'],
                        kuantitas: this.par.charge.item_part[k]['kuantitas'],
                        net_biaya: this.par.charge.item_part[k]['net_biaya'],
                        nilai_biaya: this.par.charge.item_part[k]['nilai_biaya'],
                        perbaikan_id: this.par.charge.item_part[k]['perbaikan_id'],
                    });
                }
            }

            this.pic1 =  (this.par.photo1=='./assets/images/img-not-found.jpg' ? '': this.par.ron + '-part1.jpg');
            this.pic2 = (this.par.photo2=='./assets/images/img-not-found.jpg' ? '': this.par.ron + '-part2.jpg');
            this.pic3 = (this.par.photo3=='./assets/images/img-not-found.jpg' ? '': this.par.ron + '-garansi1.jpg');
            this.pic4 = (this.par.photo4=='./assets/images/img-not-found.jpg' ? '': this.par.ron + '-garansi2.jpg');
            this.sign = (this.par.signatureImage == undefined ? '': this.par.ron + '-sign.jpg');

            this.arr_token = this.api.random();
            this.arrpart = {part: arr_part};
            // console.log('Ini Arr_part '+arr_part);
            this.param = {
                params: {
                mod: 'update_ron',
                // mod: 'update_ron_yudi', // pake yang ini, kalo ada update fitur baru Jangan lupa!!
                act: 'hasil_perbaikan',
                newid: this.makeid(25),
                alasanTunda: this.par.alasanTunda,
                alasan_desc: this.par.alasan_desc,
                nama_teknisi: this.nama_teknisi,
                email: this.par.email,
                defect: this.par.defect,
                garansi: this.par.garansi,
                keluhan: this.par.keluhan,
                keterangan: this.par.keterangan,
                level: this.par.level,
                modelno: this.par.modelno,
                product_id : this.par.product_no,
                no_garansi: this.par.no_garansi,
                note: this.par.note,
                pending: this.par.pending,
                perbaikan: this.par.perbaikan,
                photo1: this.pic1 ,
                photo2:  this.pic2,
                photo3:  this.pic3,
                photo4:  this.pic4,
                ron: this.par.ron,
                log_id: this.par.log_id,
                serialno: this.par.serialno,
                konsumen_id: this.par.konsumen_id,
                form_no: this.par.form_no,
                cu: this.par.cu,
                sign: this.sign,
                referensibayar: this.referensibayar,
                stok_dealer: this.par.stok_dealer,
                tgl_beli: this.par.tgl_beli,
                tipe_servis: this.par.tipe_servis,
                charge: JSON.stringify(arr_charge),
                // part: JSON.stringify(arr_part),
                waktu: JSON.stringify(arr_waktu),
                perbaikan_id : this.par.perbaikan_id,
                status_garansi : this.par.status_garansi,
                nama_dealer: this.par.nama_dealer,
                rand: this.arr_token.rand,
                sessid: this.arr_token.sessid,
                token: this.arr_token.token,
                
                }
            };
            // console.log(this.param);
        });
    
  }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad MetodepayPage');
        const loader = this.loadingCtrl.create({
            content: "Mohon Tunggu, Sedang menunggu respon server...",
            //duration: 3000
        });
        
        this.total = this.par.total;
        if(this.status){
            loader.present();
            this.viewCtrl.showBackButton(false);
            this.storage.get('login').then(usr => {
                this.param['params']['usr'] = usr;
                this.api.getApi(this.param).then(data => 
                {
                    // console.log(data['data']);
                    if(data['STATUS'] =="SUKSES") {
                    
                        //this.saveImage();
                        this.events.publish('refreshron:created',Date.now());
                        this.text_berhasil = "Berhasil menyimpan, saat ini ron berstatus pending.";
                        this.storage.get('draft_ron').then(draft => {
                                if(draft != undefined){
                                    for(var k = 0; k < draft.length; k++){
                                        if(draft[k]['ron'] == this.par.ron){
                                            draft.splice(k, 1);
                                            this.api.setmemory('draft_ron',draft);
                                
                                        }
                                    }
                                }
                            });
                        loader.dismiss();
                    }else if(data['STATUS'] =="TRYAGAIN"){
                        this.api.showAlert("Silahkan coba lagi");
                        loader.dismiss();
                    }else{
                        this.text_berhasil = "Gagal menyimpan, cek kembali data anda.";
                        this.api.showAlert(data['error']['error']);
                        loader.dismiss();
                    }
                });
            });
        }
    }

    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    saveImage(){
    //alert(this.par.photo1);
    //alert(this.pic1);
        // if(this.par.photo1 !='./assets/images/img-not-found.jpg') {
        //     this.pushImage(this.pic1, this.par.photo1, 'part');
        // }
        // if(this.par.photo2 !='./assets/images/img-not-found.jpg') {
        //     this.pushImage(this.pic2, this.par.photo2, 'part');
        // }
        // if(this.par.photo3 !='./assets/images/img-not-found.jpg') {
        //     this.pushImage(this.pic3, this.par.photo3, 'garansi');
        // }
        // if(this.par.photo4 !='./assets/images/img-not-found.jpg') {
        //     this.pushImage(this.pic4, this.par.photo4, 'garansi');
        // }
        //alert(this.sign);
        if(this.par.signatureImage != undefined) {
            this.pushImage(this.sign, this.par.signatureImage, 'signature');
        }
        
        
    }
    pushImage(picture, photo, target){
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
            fileKey: 'file',
            //mimeType :'image/jpeg',
            fileName: picture,
            headers: {}
        }

        fileTransfer.upload(photo, 'http://103.86.154.244/apimobile/live/ws/upload/upload.php?target=' + target, options)
        .then((data) => { 
            alert('sukses upload '+ picture);
        }, (err) => {
            alert("error : "+JSON.stringify(err));
        });
    }

    backRoot() {
        this.navCtrl.setRoot(ListwoPage);
    }

    getTotal(disc){
        if(disc == '1992'){
            let discamount = parseInt(this.par.total)*5/100;
            this.hasil = parseInt(this.par.total)-discamount;
            this.hasilDiskon = parseInt(this.par.total)*5/100;
            this.ketdiskon = '* Customer mendapatkan diskon sebesar 5%.';
            // console.log(this.hasil);
        }else{
            this.hasil = this.par.total;
            this.hasilDiskon = 0;
            this.ketdiskon = '';
        }
    }

    submitpayment(){
        debugger;
        if(this.metodepembayaran == '0' || this.metodepembayaran == undefined){
            this.api.showAlert("Metode pembayaran belum dipilih!");
        }else if(this.metodepembayaran == '1992'){
            let cek = this.referensibayar;
            if(cek == ''){
                this.api.showAlert("Referensi pembayaran tidak boleh kosong!");
            }else{
                this.ewallet();
            }
        }else if(this.metodepembayaran == '929' || this.metodepembayaran == '407'){
            this.tunai();
        }else{
            this.va(); //virtual account
        }
    }

    va(){
        var nilai = this.par.total;
        const loader = this.loadingCtrl.create({
            content: "Mohon Tunggu, Sedang menunggu respon server...",
        });
        this.storage.get('login').then(usr => {
            this.param['params']['usr'] = usr;
            loader.present();
            this.arr_token = this.api.random();
            
            this.storage.get('prof').then(profile => {
                this.param['params']['usr'] = profile.nik;
                this.param['params']['payment_metode'] = this.metodepembayaran;
                this.param['params']['total'] = this.par.total;
                this.param['params']['diskon_ron'] = 0; // Disimpan ke konsumen_produk_perbaikan field diskon_ron
                this.param['params']['referensibayar'] = 'NULL';
                this.api.getApi(this.param).then(data => {
                    if(data['STATUS'] =="SUKSES") {
                        loader.dismiss();
                        //this.events.publish('refreshron:created',Date.now());
                        this.navCtrl.push('SuccessPage', {
                            param: this.param,
                            semua: this.par
                        });
                        this.storage.get('draft_ron').then(draft => {
                            if(draft != undefined){
                                for(var k = 0; k < draft.length; k++){
                                    if(draft[k]['ron'] == this.par.ron){
                                        draft.splice(k, 1);
                                        this.api.setmemory('draft_ron',draft );
                                    }
                                }
                            }
                        });
                        
                    }else{
                        this.api.showAlert(JSON.stringify(data['error']));
                        loader.dismiss();
                    }
                });
            });
        });
    }

    tunai(){
        var nilai = this.par.total;
        const loader = this.loadingCtrl.create({
            content: "Mohon Tunggu, Sedang menunggu respon server...",
        });
        this.storage.get('login').then(usr => {
            this.param['params']['usr'] = usr;
            // loader.present();
            this.arr_token = this.api.random();
            
            this.storage.get('prof').then(profile => {
                this.param['params']['usr'] = profile.nik;
                this.param['params']['payment_metode'] = this.metodepembayaran;
                this.param['params']['total'] = this.par.total;
                this.param['params']['diskon_ron'] = 0; // Disimpan ke konsumen_produk_perbaikan field diskon_ron
                this.param['params']['referensibayar'] = 'NULL';
                // console.log(this.arrpart);
                this.api.getApissssssss(this.param,  this.arrpart).then(data => {
                    if(data['STATUS'] =="SUKSES") {
                         loader.dismiss();
                        //this.events.publish('refreshron:created',Date.now());
                        this.navCtrl.push('SuccessPage', {
                            param: this.param,
                            semua: this.par
                        });
                        this.storage.get('draft_ron').then(draft => {
                            if(draft != undefined){
                                for(var k = 0; k < draft.length; k++){
                                    if(draft[k]['ron'] == this.par.ron){
                                        draft.splice(k, 1);
                                        this.api.setmemory('draft_ron',draft );
                                    }
                                }
                            }
                        });
                    }else if(data['STATUS'] == "GAGAL"){
                        this.api.showAlert(data['MESSAGE']);
                        loader.dismiss();
                    }
                });
            });
        });
    }

    ewallet(){
        var nilai = this.par.total;
        var abc = "";
        if(this.wallet == "1992"){
            abc = this.wallet;
        }

        const loader = this.loadingCtrl.create({
            content: "Mohon Tunggu, Sedang menunggu respon server...",
        });
        this.storage.get('login').then(usr => {
            this.param['params']['usr'] = usr;
            //this.param['params']['peyment_metode'] = 
            loader.present();
            this.arr_token = this.api.random();
            
            this.storage.get('prof').then(profile => {
                this.param['params']['usr'] = profile.nik;
                this.param['params']['payment_metode'] = this.metodepembayaran;
                this.param['params']['total'] = this.par.total;
                this.param['params']['diskon_ron'] = 5; // Disimpan ke konsumen_produk_perbaikan field diskon_ron
                this.param['params']['referensibayar'] = this.referensibayar;
                this.api.getApi(this.param).then(data => {
                    if(data['STATUS'] =="SUKSES") {
                        loader.dismiss();
                        //this.events.publish('refreshron:created',Date.now());
                        this.navCtrl.push('SuccessPage', {
                            param: this.param,
                            semua: this.par
                        });
                        this.storage.get('draft_ron').then(draft => {
                            if(draft != undefined){
                                for(var k = 0; k < draft.length; k++){
                                    if(draft[k]['ron'] == this.par.ron){
                                        draft.splice(k, 1);
                                        this.api.setmemory('draft_ron',draft );
                                    }
                                }
                            }
                        });
                        
                    }else{
                        this.api.showAlert(JSON.stringify(data['error']));
                        loader.dismiss();
                    }
                });
            });
        });
    }


}
