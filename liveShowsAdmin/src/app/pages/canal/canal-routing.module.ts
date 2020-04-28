import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CanalPage } from './canal';
import { CadastrarCanalPage } from './inserir/inserir-canal';

const routes: Routes = [
  {
    path: '',
    component: CanalPage
  },
  {
    path: 'cadastrar',
    component: CadastrarCanalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CanalPageRoutingModule { }
