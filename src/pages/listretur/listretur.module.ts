import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListreturPage } from './listretur';
import { CariReturPipe } from '../../pipes/cari-retur/cari-retur';

@NgModule({
  declarations: [
    ListreturPage,
    CariReturPipe
  ],
  imports: [
    IonicPageModule.forChild(ListreturPage),
  ],
})
export class ListreturPageModule {}
