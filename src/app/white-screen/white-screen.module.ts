import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { WhiteScreenPageRoutingModule } from './white-screen-routing.module';

import { WhiteScreenPage } from './white-screen.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WhiteScreenPageRoutingModule
  ],
  declarations: [WhiteScreenPage]
})
export class WhiteScreenPageModule {}
