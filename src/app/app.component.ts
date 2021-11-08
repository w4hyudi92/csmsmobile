import { Component, ViewChild } from '@angular/core';
import { AlertController, Nav,NavController, Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device';
import { ApiProvider } from '../providers/api/api';
//import { AuthService } from '../services/auth.services';
import { HomePage } from '../pages/home/home';
import { RegisterPage } from '../pages/register/register';
import { Push, PushObject, PushOptions } from '@ionic-native/push';
import { AngularFireModule } from 'angularfire2';
import { firebaseConfig } from './app.config.firebase';

export interface PageInterface {
  title: string;
  pageName: string;
  tabComponent?: any;
  index?: number;
  icon: string;
}

@Component({
  templateUrl: 'app.html',
  providers: [ApiProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  @ViewChild('mycontent') childNavCtrl: NavController;

  public param:any;
  public arr_token: any;
  rootPage: any;
  imageURL:any;

  

  pages: PageInterface[] = [
    { title: 'Home', pageName: 'TabsPage', tabComponent: 'HomePage', index: 0, icon: 'home' },
    { title: 'Notifikasi', pageName: 'TabsPage', tabComponent: 'Tab1Page', index: 1, icon: 'megaphone' },
    // { title: 'Profil', pageName: 'TabsPage', tabComponent: 'Tab2Page', index: 2, icon: 'contacts' },
    { title: 'Setting', pageName: 'TabsPage',tabComponent: 'SpecialPage', index: 2, icon: 'more' },
    { title: 'Keluar', pageName: 'LogoutPage',tabComponent: 'LogoutPage', icon: 'log-out' },
  ];

  //pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, 
            public statusBar: StatusBar, 
            public splashScreen: SplashScreen,
            public alertCtrl: AlertController,
            private storage: Storage,
            private device: Device,
            public api: ApiProvider,
            private push: Push,
            //private auth: AuthService,
            public app: App) {
              this.initializeApp();
              AngularFireModule.initializeApp(firebaseConfig);
              this.pushsetup();
              this.imageURL =  './assets/images/profile.png';
  }
  

  ionViewDidLoad() {
    if(this.device.isVirtual == null){
        console.log("you're running in simulator");
        this.storage.set('deviceid', 'fM06td37jUA:APA91bEPOqU-y0bFor9X80jVxgATfoIiBA_3jXI_MCp7w4v8VFlCzcw9zc4tZnHAhY4uF5BiSS5UUAPE_D3PiL6_WEHB0FnOsMiXjG1intjPooyHsYWeotf0rRCH7nMyqBURLTaFjkzG');
        this.storage.set('uuid','978345');
        this.storage.set('rand','123123');
        this.storage.set('token','158fba888eff0e4eacfb0d53987bb7c07e547361');
    }

    
  }

  pushsetup(){
    this.rootPage=LoginPage;
    // this.push.hasPermission()
    //   .then((res: any) => {

    //     if (res.isEnabled) {
    //       console.log('We have permission to send push notifications');
    //     } else {
    //       console.log('We don\'t have permission to send push notifications');
    //     }

    //   });

    if(this.device.isVirtual == null){
        console.log("you're running in simulator");
        this.storage.set('deviceid', 'cdpqvof4zW4:APA91bHD-UaJl0di4d7lAUfjHnNuiArLhn5Zt53IlU7Ilv30eoN2TKXWqRG2wmfZyESEDzTtw2rF164BnyCFXaZr5G-H-vmNMS-0mJLB4MlTIWn8XVlNhx__dwWpB6QmKgMpb3SBtP5h');
        this.storage.set('uuid','978345');
        this.storage.set('rand','123123');
        this.storage.set('token','158fba888eff0e4eacfb0d53987bb7c07e547361');
        }
    //alert(this.device.uuid);
    //alert(this.device.isVirtual);

    const options: PushOptions = {
        android: {
            senderID:"448392195185",
            sound:  true,
            vibrate: true,

            //forceShow: true,
        },
        ios: {
            alert: 'true',
            badge: true,
            sound: 'false'
        }
     };
     
      const pushObject: PushObject = this.push.init(options);
     
     
      pushObject.on('registration').subscribe((registration: any) => {
        //alert(JSON.stringify(registration));
        this.storage.set('deviceid', registration.registrationId);
      });

      //pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));
      pushObject.on('notification').subscribe((notification: any) =>{
        console.log('Received a notification', notification);
    
       let confirmAlert = this.alertCtrl.create({
              title: notification['title'],
              message: notification['message'],
              buttons: [{
                text: 'Abaikan',
                role: 'cancel'
              }, {
                text: 'Lihat',
                handler: () => {
                  //alert(JSON.stringify(notification));
                  //self.nav.push(DetailsPage, {message: data.message});
                  this.app.getRootNav().push('NotifikasiPage');
                  //this.nav.setRoot('NotifikasiPage');
                }
              }]
            });
            confirmAlert.present();

    });
     
    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
    
  }


  initializeApp() {
    
    this.platform.ready().then(() => {
      this.rootPage=LoginPage;
      this.statusBar.styleDefault();
      this.splashScreen.hide();  
      //this.getBahasa();    
    });
  }

  openPage(page: PageInterface) {
    let params = {};
    //this.rootPage=TabsPage;
    
    // The index is equal to the order of our tabs inside tabs.ts
    if (page.index != null) {
      params = { tabIndex: page.index };
    }

    if (this.nav.getActiveChildNav() && page.index != undefined) {
      console.log(params);
      this.app.getRootNav().push(page.pageName, params)
    } else {
      this.nav.setRoot(page.pageName, params);
    }
  }

  logout() {
    //this.auth.signOut();
    this.storage.remove('login');
    this.nav.setRoot(HomePage);
  }

  registrasi(){
    this.nav.swipeBackEnabled = false;
    this.nav.setRoot(RegisterPage);

  }
  home(){
    this.nav.setRoot(HomePage);

  }

}
