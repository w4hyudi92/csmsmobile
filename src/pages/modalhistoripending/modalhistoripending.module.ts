import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalHistoriPending } from './modalhistoripending';

@NgModule({
  declarations: [
    ModalHistoriPending
  ],
  imports: [
    IonicPageModule.forChild(ModalHistoriPending),
  ],
})
export class ModalHistoriPendingPageModule {}
