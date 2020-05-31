import { LiveCardComponent } from './../../components/live-card/live-card.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LivesPageRoutingModule } from './lives-routing.module';

import { LivesPage } from './lives.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LivesPageRoutingModule
  ],
  exports: [
    LivesPage
  ],
  declarations: [LivesPage, LiveCardComponent]
})
export class LivesPageModule {}
