import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
// import { HomePagePageRoutingModule } from './home-page-routing.module';
import { HomePagePage } from './home-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
	  TranslateModule,
    ReactiveFormsModule,
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
