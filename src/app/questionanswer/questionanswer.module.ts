import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { QuestionanswerPageRoutingModule } from './questionanswer-routing.module';

import { QuestionanswerPage } from './questionanswer.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    QuestionanswerPageRoutingModule
  ],
  declarations: [QuestionanswerPage]
})
export class QuestionanswerPageModule {}
