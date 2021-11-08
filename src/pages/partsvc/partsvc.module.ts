import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartsvcPage } from './partsvc';

@NgModule({
  declarations: [
    PartsvcPage,
  ],
  imports: [
    IonicPageModule.forChild(PartsvcPage),
  ],
})
export class PartsvcPageModule {}
