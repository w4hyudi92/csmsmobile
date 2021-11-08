import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListkonsumenPage } from './listkonsumen';
import { CarikonsumenPipe } from '../../pipes/carikonsumen/carikonsumen';

@NgModule({
  declarations: [
    ListkonsumenPage,
    CarikonsumenPipe
  ],
  imports: [
    IonicPageModule.forChild(ListkonsumenPage),
  ],
})
export class ListkonsumenPageModule {}
