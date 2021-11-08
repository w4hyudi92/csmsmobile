import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListrentalPage } from './listrental';
import { CariRentalPipe } from '../../pipes/cari-rental/cari-rental';

@NgModule({
  declarations: [
    ListrentalPage,
    CariRentalPipe
  ],
  imports: [
    IonicPageModule.forChild(ListrentalPage),
  ],
})
export class ListrentalPageModule {}
