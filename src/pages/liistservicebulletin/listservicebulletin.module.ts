import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListservicebulletinPage } from './listservicebulletin';
import { DateformatPipe } from '../../pipes/dateformat/dateformat';

@NgModule({
  declarations: [
    ListservicebulletinPage
  ],
  imports: [
    IonicPageModule.forChild(ListservicebulletinPage),
  ],
})
export class ListservicebulletinPageModule {}