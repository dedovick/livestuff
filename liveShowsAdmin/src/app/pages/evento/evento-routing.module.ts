import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CadastrarEventoPage } from './inserir/inserir-evento';
import { EventosPage } from './eventos';

const routes: Routes = [
  {
    path: 'cadastrar',
    component: CadastrarEventoPage
  },
  {
    path: '',
    component: EventosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventoPageRoutingModule { }
