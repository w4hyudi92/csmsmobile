import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { RequestlistPage } from './requestlist';

@NgModule({
  declarations: [
    RequestlistPage,
  ],
  imports: [
    IonicPageModule.forChild(RequestlistPage),
  ],
})
export class RequestlistPageModule {}
