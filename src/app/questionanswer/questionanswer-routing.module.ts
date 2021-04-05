import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { QuestionanswerPage } from './questionanswer.page';

const routes: Routes = [
  {
    path: '',
    component: QuestionanswerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuestionanswerPageRoutingModule {}
