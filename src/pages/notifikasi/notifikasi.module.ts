import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotifikasiPage } from './notifikasi';
import { DateformatPipe } from '../../pipes/dateformat/dateformat';

@NgModule({
  declarations: [
    NotifikasiPage,
    DateformatPipe
  ],
  imports: [
    IonicPageModule.forChild(NotifikasiPage),
  ],
})
export class NotifikasiPageModule {}
