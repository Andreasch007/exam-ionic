import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Routes,RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { HomePagePage } from './home-page.page';

const routes: Routes = [
  {
    path: '',
    component: HomePagePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
	  TranslateModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePagePage
      }
    ])
  ],
})
export class HomePagePageRoutingModule {}
