import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListkonsumenprtsPage } from './listkonsumenprts';
import { CarikonsumenPipe } from '../../pipes/carikonsumen/carikonsumen';

@NgModule({
  declarations: [
    ListkonsumenprtsPage,
    CarikonsumenPipe
  ],
  imports: [
    IonicPageModule.forChild(ListkonsumenprtsPage),
  ],
})
export class ListkonsumenprtsPageModule {}
