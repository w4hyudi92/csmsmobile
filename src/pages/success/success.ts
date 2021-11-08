import { Component } from '@angular/core';
//import { HttpClient } from '@angular/common/http';
import { IonicPage, NavController, ViewController, NavParams, Platform, Events, AlertController } from 'ionic-angular';
import { ListwoPage } from './../listwo/listwo';
import { ApiProvider } from '../../providers/api/api';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { Storage } from '@ionic/storage';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { FileOpener } from '@ionic-native/file-opener';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-success',
  templateUrl: 'success.html',
})
export class SuccessPage {
    public idParam;
    header = [];
    headerItems = [];
    param: any;
    allParam: any;
    pdfObj = null;
    email: String;
    public arr_token: any;
    public params;

    constructor(public navCtrl: NavController, 
        public navParams: NavParams,
        private file: File, 
        private filePath: FilePath,
        private fileOpener: FileOpener,
        private plt: Platform,
        public api: ApiProvider,
        public events: Events,
        public atrCtrl: AlertController,
        private storage: Storage,
  		private viewCtrl: ViewController) {
            this.param = navParams.get("param");
            this.allParam = navParams.get("semua");
            let backAction =  plt.registerBackButtonAction(() => {
                this.navCtrl.setRoot(ListwoPage);
              })
         
 
            // this.storage.get('inv').then(data => {
            //     this.idParam = data;
            // });
    }

    ionViewDidLoad() {
         //this.initializeItemsInvoice(); 
         this.viewCtrl.showBackButton(false);
    }

  	backRoot() {
        this.events.publish('refreshron:created',Date.now());
		this.navCtrl.setRoot(ListwoPage);
	}

    initializeItemsInvoice() {
        
    }


    /*createPdf() {
        var nilai = this.param.params.total;
        var total = 0;
        var diskonttp = 0;
        var payment_metode = this.param.params.payment_metode;
        var diskon = this.param.params.diskon_ron;
        if(this.param.params.payment_metode == "1992"){
            payment_metode = "E-Wallet";
            if((nilai*diskon/100) > 50000){
                diskonttp = 50000;
                total = nilai-diskonttp;
            }else if((nilai*diskon/100) <= 50000){
                diskonttp = (nilai*diskon/100);
                total = nilai-(nilai*diskon/100);
            }
        }else{
            payment_metode = "Cash";
            total = nilai;
        }

        this.storage.get('prof').then(profile => {
            var docDefinition = {
            footer: [
                {
                columns: [
                { text: ':: TERIMA KASIH TELAH MENJADI PARTNER MODENA ::', alignment: 'center',fontSize: 10 }
                ],
                },
                { text: ':: CALL CENTRE ::', alignment: 'center',fontSize: 10 },
                { text: '15.007.15', alignment: 'center',fontSize: 10 },
            ],
            content: [
                {
                columns: [
                    {
                    image: 'data:image/png;base64,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',
                    fit: [100, 100],
                    style: 'foto'
                    }]
                },
                { text: 'INVOICE REPAIR', style: 'header',marginTop:10 },
                { text: this.allParam.waktu.finish_repair, fontSize: 9, alignment: 'center', marginBottom:5 },
                {
                canvas: [
                {   
                    type: 'line', 
                    x1: 0, 
                    y1: 5, 
                    x2: 220, 
                    y2: 5, 
                    lineWidth: 1 ,
                }]
                },
                { text: '', fontSize: 9, alignment: 'center', marginBottom:5 },
                {
                
                table: {
                    headerRows: 1,
                    style: 'tabel',
                    body: [
                    [ { text: 'No Nota', style: 'subheader' }, { text: ':', style: 'subheader' }, { text: (this.param.params.form_no=='null'? this.param.params.ron : this.param.params.ron + '/' + this.param.params.form_no) , style: 'subheader' } ],
                    [ { text: 'Teknisi',style: 'subheader'},{ text: ':', style: 'subheader' }, { text: profile.nama_lengkap, style: 'subheader' } ],
                    [ { text: 'Customer', style: 'subheader' },{ text: ':', style: 'subheader' }, { text: this.allParam.nama_konsumen, style: 'subheader' } ],
                    [ { text: 'Keluhan', style: 'subheader'},{ text: ':', style: 'subheader' }, { text: this.param.params.modelno + ' / ' + this.allParam.keluhan_desc, style: 'subheader' } ],
                    [ { text: 'Pembayaran', style: 'subheader' },{ text: ':', style: 'subheader' }, { text: payment_metode, style: 'subheader' } ],
                    ]
                },
                layout: 'noBorders'
                },
                {
                canvas: [
                {   
                    type: 'line', 
                    x1: 0, 
                    y1: 5, 
                    x2: 220, 
                    y2: 5, 
                    lineWidth: 1 ,
                }]
                },
                { text: '', fontSize: 9, alignment: 'center' },
                { text: 'Rincian Biaya Perbaikan :', style: 'story', margin: [0, 10, 0, 5]},
                {
                
                table: {
                    headerRows: 1,
                    widths: [ 100, 100],
                    body: [
                    [ { text: '1. Kunjungan', fontSize: 9 }, { text: parseInt(this.allParam.charge.net_kunjungan).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") , fontSize: 9,alignment: 'right' } ],
                    [ { text: '2. Material', fontSize: 9}, { text: parseInt(this.allParam.charge.net_material).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 9,alignment: 'right' } ],
                    [ { text: '3. Level Perbaikan', fontSize: 9 }, { text: parseInt(this.allParam.charge.net_kerja).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 9,alignment: 'right' } ],
                    [ { text: '4. Lain-lain', fontSize: 9}, { text: parseInt(this.allParam.charge.net_lain).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 9,alignment: 'right' } ],
                    [ { text: '5. Part', fontSize: 9 }, { text: parseInt(this.allParam.charge.net_part).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 9,alignment: 'right' } ],
                    //[ { text: 'Subtotal', fontSize: 10, bold: true }, { text: (nilai== null ? 0 : nilai.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")), fontSize: 9,alignment: 'right' } ],
                    [ { text: 'Diskon ( - )', fontSize: 10, bold: true }, { text: (diskonttp== null ? 0 : diskonttp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")), fontSize: 9,alignment: 'right' } ],
                    [ { text: '', fontSize: 9 }, { text: '', fontSize: 9 } ],
                    ]
                },
                layout: 'noBorders'
                },
                {
                canvas: [
                {   
                    type: 'line', x1: 0, y1: 5, x2: 220, y2: 5, lineWidth: 1 ,
                }]
                },
                { text: '', fontSize: 9, alignment: 'center', marginBottom:5 },
                {
                columns: [
                    { text: 'Total', fontSize: 11, bold: true, alignment: 'left' },
                    { text: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","), fontSize: 11, bold: true, alignment: 'right',paddingRight: 5 }
                ]
                },
                {
                canvas: [
                {   
                    type: 'line', x1: 0, y1: 5, x2: 220, y2: 5, lineWidth: 1 ,
                }]
                },
                { text: '', fontSize: 9, alignment: 'center', marginBottom:5 },
                { text: 'Note : ' + this.param.params.keterangan, fontSize: 9,italic: true, alignment: 'left' },
            ],
            pageSize: 'A6',
            styles: {
                
                foto: {
                alignment: 'center',
                },
                header: {
                fontSize: 12,
                bold: true,
                alignment: 'center',
                },
                subheader: {
                fontSize: 9,
                bold: true,
                },
                story: {
                fontSize: 10,
                italic: true,
                alignment: 'left',
                width: '50%',
                bold: true,
                }
            }
            }
            this.pdfObj = pdfMake.createPdf(docDefinition);
            this.downloadPdf(this.param.params.ron);
        });
    }
    
    downloadPdf(ron) {
        this.pdfObj.getBuffer((buffer) => {
        var blob = new Blob([buffer], { type: 'application/pdf' });
        if (this.plt.is('cordova')) {
            this.file.writeFile(this.file.externalRootDirectory, 'Download/'+ ron +'.pdf', blob, { replace: true }).then(fileEntry => {
            const confirm = this.atrCtrl.create({
                title: 'Informasi',
                message: 'File dokumen '+ron+'.pdf berhasil di unduh',
                buttons: [
                {
                    text: 'Tutup',
                    handler: () => {
                    // console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Buka',
                    handler: () => {
                    this.fileOpener.open(this.file.externalRootDirectory + 'Download/' + ron + '.pdf', 'application/pdf')
                        .then(() => console.log('File is opened'))
                        .catch(e => console.log('Error opening file', e));
                    }
                }
                ]
            });
            confirm.present();
            //loader.dismiss();
            });
        }else{
            this.pdfObj.download();
        }
        }, (error) => {
            console.log(error);
            const alert = this.atrCtrl.create({
            title: 'Informasi',
            subTitle: 'File dokumen gagal di unduh.',
            buttons: ['OK']
            });
            alert.present();
            //loader.dismiss();
        });
    }*/

    kirimnota(){
        var nilai = this.param.params.total;
        var total = 0;
        var diskonttp = 0;
        var payment_metode = this.param.params.payment_metode;
        var diskon = this.param.params.diskon_ron;
        if(this.param.params.payment_metode == "1992"){
            payment_metode = "E-Wallet";
            if((nilai*diskon/100) > 50000){
                diskonttp = 50000;
                total = nilai-diskonttp;
            }else if((nilai*diskon/100) <= 50000){
                diskonttp = (nilai*diskon/100);
                total = nilai-(nilai*diskon/100);
            }
        }else{
            payment_metode = "Cash";
            total = nilai;
        }
    
    
        this.arr_token = this.api.random();
        this.storage.get('prof').then(profile => {
          //this.arr_token = this.api.random();
          
          this.param = {
              params: {
              mod: 'kirimnota',
              act: 'kirimnotaemail',
              ron: this.param.params.form_no=='null'? this.param.params.ron : this.param.params.ron + '/' + this.param.params.form_no,
              email: this.email,
              waktu: this.allParam.waktu.finish_repair,
              teknisi: profile.nama_lengkap,
              customer: this.allParam.nama_konsumen,
              keluhan: this.param.params.modelno + ' / ' + this.allParam.keluhan_desc,
              pembayaran: payment_metode,
              kunjungan: parseInt(this.allParam.charge.net_kunjungan).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              material: parseInt(this.allParam.charge.net_material).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              levelperbaikan: parseInt(this.allParam.charge.net_kerja).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              lainnya: parseInt(this.allParam.charge.net_lain).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              part: parseInt(this.allParam.charge.net_part).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),              diskon: diskonttp== null ? 0 : diskonttp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              total: total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
              note: this.param.params.keterangan,
              rand: this.arr_token.rand,
              sessid: this.arr_token.sessid,
              token: this.arr_token.token
              }
          }
        });
        this.api.getApi(this.param).then(data => 
        {
          if(data['STATUS'] =="SUKSES") {
            const alert = this.atrCtrl.create({
              title: 'Berhasil',
              subTitle: 'Email Berhasil dikirim ke '+this.email,
              buttons: [{
                text: 'Oke',
                handler: () => {
                  this.navCtrl.push(ListwoPage);
                }
              }]
            });
            alert.present();
          }
        });
    }

    // whatsapp(){
    //     this.api.showAlert('Pengiriman WhatsApp Sedang dalam pengembangan..');
    // }
}
