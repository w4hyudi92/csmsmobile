import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MenusetorPage } from './menusetor';
import { DateformatPipe } from '../../pipes/dateformat/dateformat';

@NgModule({
  declarations: [
    MenusetorPage,
    DateformatPipe
  ],
  imports: [
    IonicPageModule.forChild(MenusetorPage),
  ],
})
export class MenusetorPageModule {}
