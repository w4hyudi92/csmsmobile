import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StoryservicePage } from './storyservice';

@NgModule({
  declarations: [
    StoryservicePage,
  ],
  imports: [
    IonicPageModule.forChild(StoryservicePage),
  ],
})
export class StoryservicePageModule {}
