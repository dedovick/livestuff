import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { CanalPage } from './canal';
import { CanalPageRoutingModule } from './canal-routing.module';
import { CadastrarCanalPage } from './inserir/inserir-canal';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CanalPageRoutingModule
  ],
  declarations: [
    CanalPage,
    CadastrarCanalPage
  ]
})
export class CanalModule { }
