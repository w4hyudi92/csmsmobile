import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailinvoicePage } from './detailinvoice';

@NgModule({
  declarations: [
    DetailinvoicePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailinvoicePage),
  ],
})
export class DetailinvoicePageModule {}
