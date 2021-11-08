import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModaldealerPage } from './modaldealer';
import { CariinvoicePipe } from '../../pipes/cariinvoice/cariinvoice';

@NgModule({
  declarations: [
    ModaldealerPage,
    CariinvoicePipe
  ],
  imports: [
    IonicPageModule.forChild(ModaldealerPage),
  ],
})
export class ModaldealerPageModule {}
