import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MypartPage } from './mypart';
import { CariPipe } from '../../pipes/cari/cari';

@NgModule({
  declarations: [
    MypartPage,
    CariPipe
  ],
  imports: [
    IonicPageModule.forChild(MypartPage),
    //CariPipe
  ],

})
export class MypartPageModule {}
