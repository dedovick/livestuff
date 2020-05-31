import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivesPage } from './lives.page';

const routes: Routes = [
  {
    path: '',
    component: LivesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LivesPageRoutingModule {}
