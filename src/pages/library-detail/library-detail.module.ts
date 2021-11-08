import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LibraryDetailPage } from './library-detail';
import { IonicImageLoader } from 'ionic-image-loader';
import { CariRonPipe } from '../../pipes/cari-ron/cari-ron';
@NgModule({
  declarations: [
    LibraryDetailPage,
    CariRonPipe
  ],
  imports: [
    IonicImageLoader,
    IonicPageModule.forChild(LibraryDetailPage),
  ],
})
export class LibraryDetailPageModule {}
