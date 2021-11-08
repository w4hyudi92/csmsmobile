import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Push } from '@ionic-native/push';
import { HomePage } from '../pages/home/home';
import { ListwoPage } from '../pages/listwo/listwo';
import { ListksPage } from '../pages/listks/listks';
import { FormwoPage } from '../pages/formwo/formwo';
import { FormservicebulletinPage } from '../pages/formservicebulletin/formservicebulletin';
import { DetailwoPage } from '../pages/detailwo/detailwo';
import { SchedulePage } from '../pages/schedule/schedule';
import { PromisePage } from '../pages/promise/promise';
import { MenupartPage } from '../pages/menupart/menupart';
import { StoryservicePage } from '../pages/storyservice/storyservice';
import { ListdraftPage } from '../pages/listdraft/listdraft';
import { DetailrentalPage } from '../pages/detailrental/detailrental';
import { DetailreturPage } from '../pages/detailretur/detailretur';
import { FirebasePage } from '../pages/firebase/firebase';
import { ListPage } from '../pages/list/list';
import { MenuPage } from '../pages/menu/menu';
import { LoginPage } from '../pages/login/login';
import { Camera  } from '@ionic-native/camera';  
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LayoutLoginComponent } from '../pages/layout-login/layout-login';
import { SignaturePadModule } from 'angular2-signaturepad';
import { RegisterPage } from '../pages/register/register';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';
import { Device } from '@ionic-native/device';

import { ApiProvider } from '../providers/api/api';
import {  Network   } from '@ionic-native/network'; 
import { ReactiveFormsModule } from '@angular/forms';
import { FileTransfer } from '@ionic-native/file-transfer';
//import { LoginProvider } from '../providers/login/login';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuth } from 'angularfire2/auth';
//import { AuthService } from '../services/auth.services';
import { RegisterProdukPage } from '../pages/register-produk/register-produk';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
//import { ModalItemCashbackPage } from '../pages/modal-item-cashback/modal-item-cashback';
//import { SafeHtmlPipe } from '../pipes/safe-html/safe-html';
//import { Facebook } from '@ionic-native/facebook';
import { AngularFireDatabase   } from 'angularfire2/database';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { SignaturePage } from '../pages/signature/signature';
import { SearchPipe } from '../pipes/search/search';
import { SortPipe } from '../pipes/sort/sort';
import { SearchtglPipe } from '../pipes/searchtgl/searchtgl';
import { PhonesPipe } from '../pipes/phones/phones';
import { BluetoothSerial } from '@ionic-native/bluetooth-serial';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { ShareProvider } from '../providers/share/share';
import { FileOpener } from '@ionic-native/file-opener';
import { CallNumber } from '@ionic-native/call-number';
import { Firebase } from '@ionic-native/firebase/ngx';
import { IonicImageLoader } from 'ionic-image-loader';

import { LocationTracker } from '../providers/location-tracker/location-tracker';
import { MenuksPage } from '../pages/menuks/menuks';
import { MenuinformationPage } from '../pages/menuinformation/menuinformation';
import { FtulistPage } from '../pages/ftulist/ftulist';
import { FormftuPage } from '../pages/formftu/formftu';
import { ListcekhargaPage } from '../pages/listcekharga/listcekharga';
import { FtulistronPage } from '../pages/ftulistron/ftulistron';
import { FormksPage } from '../pages/formks/formks';
import { DetailinvoicePage } from '../pages/detailinvoice/detailinvoice';
import { ListinvoicePage } from '../pages/listinvoice/listinvoice';
import { ListpendingPage } from '../pages/listpending/listpending';
import { ListkonsumenPage } from '../pages/listkonsumen/listkonsumen';
import { ListkonsumenprtsPage } from '../pages/listkonsumenprts/listkonsumenprts';
import { FormksaddPage } from '../pages/formksadd/formksadd';
import { SuccessksPage } from '../pages/successks/successks';
import { SuccessprtsPage } from '../pages/successprts/successprts';
import { HistorydetailksPage } from '../pages/historydetailks/historydetailks';
import { ModaldealerPage } from '../pages/modaldealer/modaldealer';
import { HistorydetailftuPage } from '../pages/historydetailftu/historydetailftu';
import { HistoryksPage } from '../pages/historyks/historyks';
import { SelectSearchableModule } from 'ionic-select-searchable';
import { MenusetorPage } from '../pages/menusetor/menusetor';
import { HistorisetorPage } from '../pages/historisetor/historisetor';
import { DetailSetorPage } from '../pages/detailsetor/detailsetor';
import { HistorijualpartPage } from '../pages/historijualpart/historijualpart';
import { DetailJualPartPage } from '../pages/detailjualpart/detailjualpart';
import { HistoriPendingPage } from '../pages/historipending/historipending';
import { AccordionListComponent } from '../components/accordion-list/accordion-list';
import { ModalHistoriPending } from '../pages/modalhistoripending/modalhistoripending';
import { JualPartCheckoutPage } from '../pages/jualpartcheckout/jualpartcheckout';
import { ListwoprtsPage } from '../pages/listwoprts/listwoprts';

export const firebaseConfig = {
	fire: {
		apiKey: "AIzaSyDnP2cocGByGh9V60XToMpDDz3TIBgx7lE",
    authDomain: "ciao-360cb.firebaseapp.com",
    databaseURL: "https://ciao-360cb.firebaseio.com",
    projectId: "ciao-360cb",
    storageBucket: "ciao-360cb.appspot.com",
    messagingSenderId: "532413195561",
    appId: "1:532413195561:web:1515a7d11417ec0e"

	}
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LayoutLoginComponent,
    LoginPage,
    RegisterPage,
    RegisterProdukPage,
    MenuPage,
    //ModalItemCashbackPage,
    //SafeHtmlPipe,
    ListPage,
    LayoutLoginComponent,
    LoginPage,
    MenuPage,
    MenuksPage,
    MenuinformationPage,
    ListwoPage,
    StoryservicePage,
    ListdraftPage,
    FormwoPage,
    FormservicebulletinPage,
    DetailwoPage,
    DetailrentalPage,
    DetailreturPage,
    FirebasePage,
    //InfolimitPage,
    SchedulePage,
    PromisePage,
    MenupartPage,
    SignaturePage,
    SearchPipe,
    SortPipe,
    //CariPipe,
    SearchtglPipe,
    PhonesPipe,
    FtulistPage,
    FormftuPage,
    ListcekhargaPage,
    FtulistronPage,
    FormksPage,
    FormksaddPage,
    DetailinvoicePage,
    ListinvoicePage,
    ListpendingPage,
    ListkonsumenPage,
    ListkonsumenprtsPage,
    SuccessksPage,
    SuccessprtsPage,
    HistorydetailksPage,
    ModaldealerPage,
    HistorydetailftuPage,
    MenusetorPage,
    HistorisetorPage,
    DetailSetorPage,
    DetailJualPartPage,
    HistoriPendingPage,
    AccordionListComponent,
    ModalHistoriPending,
    JualPartCheckoutPage,
    ListwoprtsPage,
    HistorijualpartPage
  ],
  imports: [
    ReactiveFormsModule,
    BrowserModule,
    HttpClientModule,
    SignaturePadModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig.fire),
    SelectSearchableModule
  ],
  exports: [
    LayoutLoginComponent,
	],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LayoutLoginComponent,
    LoginPage,
    RegisterPage,
    MenuPage,
    RegisterProdukPage,
    //ModalItemCashbackPage,
    ListPage,
    LayoutLoginComponent,
    LoginPage,
    ListcekhargaPage,
    FtulistronPage,
    //LogoutPage,
    MenuPage,
    ListwoPage,
    FormwoPage,
    FormservicebulletinPage,
    DetailwoPage,
    SchedulePage,
    PromisePage,
    MenupartPage,
    SignaturePage,
    StoryservicePage,
    ListdraftPage,
    DetailrentalPage,
    DetailreturPage,
    FirebasePage,
    MenuksPage,
    MenuinformationPage,
    FtulistPage,
    FormftuPage,
    FormksPage,
    FormksaddPage,
    DetailinvoicePage,
    ListinvoicePage,
    ListpendingPage,
    ListkonsumenPage,
    ListkonsumenprtsPage,
    SuccessksPage,
    SuccessprtsPage,
    HistorydetailksPage,
    ModaldealerPage,
    HistorydetailftuPage,
    MenusetorPage,
    HistorisetorPage,
    DetailSetorPage,
    DetailJualPartPage,
    HistoriPendingPage,
    AccordionListComponent,
    ModalHistoriPending,
    JualPartCheckoutPage,
    ListwoprtsPage,
    HistorijualpartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ApiProvider,
    Network,
    Push,
    FileTransfer,
    //LoginProvider,
    AngularFireAuth,
    //AuthService,
    Camera,
    BarcodeScanner,
    AngularFireDatabase,
    Geolocation,
    BarcodeScanner,
    Network,
    File,
    Transfer,
    FilePath,
    FileTransfer,
    BluetoothSerial,
    PhotoViewer,
    InAppBrowser,
    ShareProvider,
    FileOpener,
    CallNumber,
    LocationTracker,
    //BackgroundGeolocation,
    Geolocation,
    Firebase,
    AngularFireDatabase
  ]
})
export class AppModule {}
