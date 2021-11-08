import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListwoPage } from './listwo';
import { PhonesPipe } from '../../pipes/phones/phones';

@NgModule({
  declarations: [
    ListwoPage,
    PhonesPipe
  ],
  imports: [
    IonicPageModule.forChild(ListwoPage),
  ],
})
export class ListwoPageModule {}
