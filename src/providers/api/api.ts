import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';
import * as sha1 from 'sha1';
import { AlertController, ToastController,LoadingController,Events  } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
//import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Observable } from 'rxjs';
/*
  Generated class for the ApiProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
export enum ConnectionStatusEnum {
    Online,
    Offline
}

@Injectable()
export class ApiProvider {
    private uuid: any ;
    public data_teknisi: any;
    moda: string = 'Production';

    constructor(public httpClient: HttpClient, private device: Device, 
        private storage: Storage,
        private alertCtrl: AlertController,
        private transfer: FileTransfer,
        public loadingCtrl: LoadingController,
        //private sqlite: SQLite,
        private toastCtrl: ToastController,
        public events: Events,
        private network: Network) {
        //console.log('Hello ApiProvider Provider');
        this.storage.get('prof').then(profile => {
            this.data_teknisi = profile;
        });
        this.storage.get('mode').then(mode => {
            if(mode != null){
            this.moda = mode;
            }
        });
        events.subscribe('reload:created', eventData => { 
            this.storage.get('mode').then(mode => {
                if(mode != null){
                this.moda = mode;
                }
            });
        });
    }

    getApissssssss(param, apakekbebeas){
        var url = 'http://103.86.154.244/apimobile/live/ws/index.php';
        if(this.moda=='Development'){
            url = 'http://103.86.154.244/apimobile/live/ws/index.php';
        }
        
        return new Promise(resolve => {
            this.httpClient.post(url, apakekbebeas, param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }


    getApi(param){
        var url = 'http://103.86.154.244/apimobile/live/ws/index.php';
        if(this.moda=='Development'){
            url = 'http://103.86.154.244/apimobile/live/ws/index.php';
        }
        
        return new Promise(resolve => {
            this.httpClient.post(url, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }

    getAir(param){
        
        var url = 'http://103.86.154.244/apimobile/live/ws/index.php';
        if(this.moda=='Development'){
            url = 'http://103.86.154.244/apimobile/live/ws/index.php';
        }
        
        return new Promise(resolve => {
            this.httpClient.post(url, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }

    getImage(param){
        var url = 'http://103.86.154.244/apimobile/live/ws/upload/base.php';
        if(this.moda=='Development'){
            url = 'http://103.86.154.244/apimobile/live/ws/upload/base.php';
        }
        return new Promise(resolve => {
            this.httpClient.post(url, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }
    
    getProfile(param){
        var url = 'http://103.86.154.244/apimobile/live/ws/upload/profile.php';
        if(this.moda=='Development'){
            url = 'http://103.86.154.244/apimobile/live/ws/upload/profile.php';
        }
        return new Promise(resolve => {
            this.httpClient.post(url, null,param).subscribe(
                (data) => {
                    resolve(data);
                }, err => {
                    resolve(err);
                });
        });

    }
  
    random() {
        if(this.device.isVirtual == null){
            this.uuid = '1234';
        }else{
            this.uuid = this.device.uuid;
        }
        let rand =  Math.floor(Math.random() * 90000) + 10000;
        let token = sha1('dsvp' + rand + this.uuid);  
        let arr= {
            rand: rand,
            sessid: this.uuid,
            token: token
        };
        return arr;
    }

    setmemory(name, arr_data){
        this.storage.set(name,arr_data);
    }

    getmemory(name){
        this.storage.get(name).then(data => {
            return data;
        });
    }

    showAlert(msg){
        let alert = this.alertCtrl.create({
            title: '',
            subTitle: JSON.stringify(msg),
            buttons: ['OK']
        }).present();
    }
    showSuccess(msg){
        let toast = this.toastCtrl.create({
            message: msg,
            duration: 3000,
            position: 'middle'
          });
        
          toast.onDidDismiss(() => {
            console.log('Dismissed toast');
          });
        
          toast.present();
    }

    public initializeNetworkEvents(): void {
        //console.log('check inet');
        let disconnectSubscription = this.network.onDisconnect().subscribe(() => {
            this.showAlert('Tidak ada jaringan internet');
          });
          disconnectSubscription.unsubscribe();
    }

    pushImage(picture, photo, target){
        // const loader = this.loadingCtrl.create({
        //     content: "Uploading...",
        // });
        // loader.present();
        const fileTransfer: FileTransferObject = this.transfer.create();
        let options: FileUploadOptions = {
            fileKey: 'file',
            //mimeType :'image/jpeg',
            fileName: picture,
            headers: {}
        }
        var url = 'http://103.86.154.244/apimobile/live/ws/upload/upload.php?target=' + target;
        if(this.moda=='Development'){
            url = 'http://103.86.154.244/apimobile/live/ws/upload/upload.php?target=' + target;
        }
        fileTransfer.upload(photo, url , options)
        .then((data) => { 
            alert('Upload '+ picture + ' Sukses.');
            //loader.dismiss();
            //fileTransfer.abort();
        }, (err) => {
            alert("error : Upload gagal!!");
            //loader.dismiss();
            //fileTransfer.abort();
        });
    
    } 


    // public saveSql(query){
    //     this.sqlite.create({
    //         name: 'csms.db',
    //         location: 'default'
    //         }).then((db: SQLiteObject) => {

    //             db.executeSql(query)
    //             .then(res => {
    //                 console.log('insert');
    //                 return res;
    //             }).catch(e => console.log(e));

    //         }).catch(e => console.log(e));
            
    // }

    // public selectSql(query){
    //     this.sqlite.create({
    //         name: 'csms.db',
    //         location: 'default'
    //         }).then((db: SQLiteObject) => {

    //             db.executeSql(query, {})
    //             .then(res => {
                    
    //                 console.log('select');
                   
    //                 // for(var i=0; i<res.rows.length; i++) {
        
    //                 //     this.expenses.push({
    //                 //         rowid:res.rows.item(i).rowid,
    //                 //         date:res.rows.item(i).date,
    //                 //         type:res.rows.item(i).type,
    //                 //         description:res.rows.item(i).description,
    //                 //         amount:res.rows.item(i).amount})
    //                 // }
    //                 // console.log(JSON.stringify(this.expenses));
    //                 return res;
        
    //             }).catch(e => console.log(e));

    //         }).catch(e => console.log(e));    
    // }
}
