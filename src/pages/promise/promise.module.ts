import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PromisePage } from './promise';

@NgModule({
  declarations: [
    PromisePage,
  ],
  imports: [
    IonicPageModule.forChild(PromisePage),
  ],
})
export class PromisePageModule {}
