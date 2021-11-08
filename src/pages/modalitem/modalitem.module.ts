import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalitemPage } from './modalitem';

@NgModule({
  declarations: [
    ModalitemPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalitemPage),
  ],
})
export class ModalitemPageModule {}
