import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListCompanyPage } from './list-company.page';

const routes: Routes = [
  {
    path: '',
    component: ListCompanyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListCompanyPageRoutingModule {}
