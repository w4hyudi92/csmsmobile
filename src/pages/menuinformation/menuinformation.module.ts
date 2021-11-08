import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenuinformationPage } from './menuinformation';
import { DateformatPipe } from '../../pipes/dateformat/dateformat';

@NgModule({
  declarations: [
    MenuinformationPage,
    DateformatPipe
  ],
  imports: [
    IonicPageModule.forChild(MenuinformationPage),
  ],
})
export class MenuinformationPageModule {}
