import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'white-screen',
    pathMatch: 'full'
  },
  {
    path: 'folder',
    loadChildren: () => import('./folder/folder.module').then( m => m.FolderPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'white-screen',
    loadChildren: () => import('./white-screen/white-screen.module').then( m => m.WhiteScreenPageModule)
  },
  {
    path: 'questionanswer',
    loadChildren: () => import('./questionanswer/questionanswer.module').then( m => m.QuestionanswerPageModule)
  },
  {
    path: 'start',
    loadChildren: () => import('./start/start.module').then( m => m.StartPageModule)
  },
  {
    path: 'edit-profile',
    loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'home-page',
    loadChildren: () => import('./home-page/home-page.module').then( m => m.HomePagePageModule)
  },
  {
    path: 'list-company',
    loadChildren: () => import('./list-company/list-company.module').then( m => m.ListCompanyPageModule)
  },  {
    path: 'absensi',
    loadChildren: () => import('./absensi/absensi.module').then( m => m.AbsensiPageModule)
  },
  {
    path: 'scan-qrcode',
    loadChildren: () => import('./scan-qrcode/scan-qrcode.module').then( m => m.ScanQrcodePageModule)
  },



  // {
  //   path: 'save-data',
  //   loadChildren: () => import('./edit-profile/edit-profile.module').then( m => m.EditProfilePageModule)
  // },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
