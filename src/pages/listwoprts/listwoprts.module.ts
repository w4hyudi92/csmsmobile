import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListwoprtsPage } from './listwoprts';
import { PhonesPipe } from '../../pipes/phones/phones';

@NgModule({
  declarations: [
    ListwoprtsPage,
    PhonesPipe
  ],
  imports: [
    IonicPageModule.forChild(ListwoprtsPage),
  ],
})
export class ListwoprtsPageModule {}
