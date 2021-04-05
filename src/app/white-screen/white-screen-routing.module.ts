import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WhiteScreenPage } from './white-screen.page';

const routes: Routes = [
  {
    path: '',
    component: WhiteScreenPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WhiteScreenPageRoutingModule {}
