import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { ListCompanyPageRoutingModule } from './list-company-routing.module';
import { IonicContextMenuModule } from 'ionic-context-menu';
import { ListCompanyPage } from './list-company.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IonicContextMenuModule,
    ListCompanyPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [ListCompanyPage]
})
export class ListCompanyPageModule {}
