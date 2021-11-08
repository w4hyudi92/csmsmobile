import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListteknisiPage } from './listteknisi';
import { CariteknisiPipe } from '../../pipes/cariteknisi/cariteknisi';

@NgModule({
  declarations: [
    ListteknisiPage,
    CariteknisiPipe
  ],
  imports: [
    IonicPageModule.forChild(ListteknisiPage),
  ],
})
export class ListteknisiPageModule {}
