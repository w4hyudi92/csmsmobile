import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the BluetoothPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bluetooth',
  templateUrl: 'bluetooth.html',
  providers: [ApiProvider]
})
export class BluetoothPage {

  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  chooseDevices: Boolean;
  private device: string = '0';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private bluetoothSerial: BluetoothSerial,public api: ApiProvider,
    private alertCtrl: AlertController,) {
      bluetoothSerial.enable();
      this.chooseDevices = false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BluetoothPage');
  }

  startScanning() {
    this.pairedDevices = null;
    this.unpairedDevices = null;
    this.gettingDevices = true;

    this.bluetoothSerial.discoverUnpaired().then((success) => {
        this.unpairedDevices = success;
        this.gettingDevices = false;
        success.forEach(element => {
        
        });
    },
    (err) => {
        console.log(err);
    })

    this.bluetoothSerial.list().then((success) => {
        this.pairedDevices = success;
    },
    (err) => {

    })
  }
  success = (data) => alert(data);
  fail = (error) => alert(error);

  selectListDev(id) {
      this.device = id;
      this.api.setmemory('printer', this.device );
  }

  selectDevice(address: any) {

      let alert = this.alertCtrl.create({
          title: 'Connect',
          message: 'Do you want to connect with?',
          buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Connect',
            handler: () => {
              this.api.setmemory('id_printer', address );
              let connect = this.bluetoothSerial.connect(address).subscribe(
                  getData => {                        
                      this.bluetoothSerial.write('Test Print '+"\n\n\n").then(writeData => {
                          this.chooseDevices = true;
                          connect.unsubscribe();
                      }, 
                      connectError => {
                          this.alertCtrl.create({
                              buttons: ['OK'],
                              message: connectError,
                              title: 'Error',
                          }).present();
                      });
                  }, err => {
                      console.log(err);
                  }
              );
              
            }
          }]
      });
      alert.present();
  }

  disconnect() {
      let alert = this.alertCtrl.create({
          title: 'Disconnect?',
          message: 'Do you want to Disconnect?',
          buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Disconnect',
            handler: () => {
              this.bluetoothSerial.disconnect();
            }
          }]
      });
      alert.present();
  } 
}
