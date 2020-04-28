import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { EventosPage } from './eventos';
import { EventoPageRoutingModule } from './evento-routing.module';
import { IonicSelectableModule } from 'ionic-selectable';
import { CadastrarEventoPage } from './inserir/inserir-evento';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EventoPageRoutingModule,
    IonicSelectableModule
  ],
  declarations: [
    EventosPage,
    CadastrarEventoPage
  ]
})
export class EventoModule { }
