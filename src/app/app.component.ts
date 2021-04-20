import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { Platform, AlertController } from '@ionic/angular';
// import { SplashScreen } from '@ionic-native/splash-screen/ngx';
// import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { WonderPush } from '@ionic-native/wonderpush/ngx';
import { OneSignal } from '@ionic-native/onesignal/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    // { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    // { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  email:string;
  isLogin:number;
  category_id:number;

  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private http: HttpClient,private storage: Storage,private alertCtrl: AlertController,
              private router: Router,private oneSignal: OneSignal,private platform: Platform,
            ) {

    // this.getCategory();
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
//    this.wonderPush.subscribeToNotifications();
      this.setupPush();
    });
  }

  setupPush(){
    this.oneSignal.startInit('83a4a750-8695-4f14-858d-0a380279ef39','ZTU3MTNiMmItNzdkNy00Yzc3LTliYjAtYWQxOTM5NTJmZTMz');
    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
    this.oneSignal.handleNotificationReceived().subscribe((data) => {
      // do something when notification is received
      let msg = data.payload.body;
      let title = data.payload.title;
      let additionalData = data.payload.additionalData;
      this.showAlert(title, msg, additionalData); 
     });
    this.oneSignal.handleNotificationOpened().subscribe((data) => {
      // do something when a notification is opened
      let additionalData = data.notification.payload.additionalData;
      this.showAlert('Notification opened','You already read this before', additionalData.task)
    });
    this.oneSignal.endInit();

    this.oneSignal.getIds().then(identity => {
      this.storage.set('playerID',identity.userId);
      // alert(identity.userId + " It's Devices ID");
    });
  }


  async showAlert(title, msg, task){
    const alert = await this.alertCtrl.create({
      header: title,
      subHeader: msg,
      buttons: [
        {
          text: `Action: ${task}`,
          handler: () => {

          }
        }
      ]
    })
  }

  // async getCategory(){
  //     await this.storage.get('email').then((val) => {
  //       this.email = val;
  //       console.log('Email :'+JSON.stringify(this.email))
  //     });
  //     if(this.email!=null){
  //       var formData : FormData = new FormData();
  //       formData.set('email', this.email);
  //       this.http.post('https://exam.graylite.com/api/category',formData)
  //       .subscribe((response) => {
  //         this.appPages = response['data'];
  //         console.log(this.appPages);
  //         console.log(this.category_id);
  //       });
  //     }  
  // }

  // doRefresh(event) {
  //   console.log('Begin async operation');
  //   this.getCategory();
  //   setTimeout(() => {
  //     console.log('Async operation has ended');
  //     event.target.complete();
  //   }, 2000);
  // }

  // async sendCategory(id){
  //   // console.log(id);
  //   await this.storage.set('category_id',id);
  // }
}
