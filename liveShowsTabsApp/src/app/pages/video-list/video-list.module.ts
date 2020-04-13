import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VideoListPageRoutingModule } from './video-list-routing.module';

import { VideoListPage } from './video-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VideoListPageRoutingModule
  ],
  declarations: [VideoListPage]
})
export class VideoListPageModule {}
