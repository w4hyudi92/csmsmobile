import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListksPage } from './listks';
import { CariksPipe } from '../../pipes/cariks/cariks';

@NgModule({
  declarations: [
    ListksPage,
    CariksPipe
  ],
  imports: [
    IonicPageModule.forChild(ListksPage),
  ],
})
export class ListksPageModule {}
