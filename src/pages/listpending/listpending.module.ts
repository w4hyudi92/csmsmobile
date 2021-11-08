import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListpendingPage } from './listpending';
import { PhonesPipe } from '../../pipes/phones/phones';

@NgModule({
  declarations: [
    ListpendingPage,
    PhonesPipe
  ],
  imports: [
    IonicPageModule.forChild(ListpendingPage),
  ],
})
export class ListpendingPageModule {}
