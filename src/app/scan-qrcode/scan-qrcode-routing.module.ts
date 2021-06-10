import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScanQrcodePage } from './scan-qrcode.page';

const routes: Routes = [
  {
    path: '',
    component: ScanQrcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScanQrcodePageRoutingModule {}
