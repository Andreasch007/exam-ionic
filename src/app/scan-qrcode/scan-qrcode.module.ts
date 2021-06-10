import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanQrcodePageRoutingModule } from './scan-qrcode-routing.module';

import { ScanQrcodePage } from './scan-qrcode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanQrcodePageRoutingModule
  ],
  declarations: [ScanQrcodePage]
})
export class ScanQrcodePageModule {}
