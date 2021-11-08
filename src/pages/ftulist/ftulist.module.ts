import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FtulistPage } from './ftulist';
import { PhonesPipe } from '../../pipes/phones/phones';

@NgModule({
  declarations: [
    FtulistPage,
    PhonesPipe
  ],
  imports: [
    IonicPageModule.forChild(FtulistPage),
  ],
})
export class FtulistPageModule {}
