import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListinvoicePage } from './listinvoice';
import { CariinvoicePipe } from '../../pipes/cariinvoice/cariinvoice';

@NgModule({
  declarations: [
    ListinvoicePage,
    CariinvoicePipe
  ],
  imports: [
    IonicPageModule.forChild(ListinvoicePage),
  ],
})
export class ListinvoicePageModule {}
