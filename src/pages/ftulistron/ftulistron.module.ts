import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FtulistronPage } from './ftulistron';
import { PhonesPipe } from '../../pipes/phones/phones';

@NgModule({
  declarations: [
    FtulistronPage,
    PhonesPipe
  ],
  imports: [
    IonicPageModule.forChild(FtulistronPage),
  ],
})
export class FtulistronPageModule {}
