import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
// import { HomePagePageRoutingModule } from './home-page-routing.module';
import { HomePagePage } from './home-page.page';

import { IonicContextMenuModule } from 'ionic-context-menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
	  TranslateModule,
    ReactiveFormsModule,
    IonicContextMenuModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePagePage
      }
    ])
  ],
  declarations: [HomePagePage]
})
export class HomePagePageModule {}
