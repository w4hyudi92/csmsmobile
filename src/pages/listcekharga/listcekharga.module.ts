import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListcekhargaPage } from './listcekharga';
import { PhonesPipe } from '../../pipes/phones/phones';

@NgModule({
  declarations: [
    ListcekhargaPage,
    PhonesPipe
  ],
  imports: [
    IonicPageModule.forChild(ListcekhargaPage),
  ],
})
export class ListcekhargaPageModule {}
