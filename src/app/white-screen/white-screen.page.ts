import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-white-screen',
  templateUrl: './white-screen.page.html',
  styleUrls: ['./white-screen.page.scss'],
})
export class WhiteScreenPage implements OnInit {
  email:string;
  device_id : any;
  UniqueDeviceID:string;
  constructor(private storage: Storage,private router: Router,private alertCtrl: AlertController,
    private uniqueDeviceID: UniqueDeviceID,
    private device : Device,
    private uid: Uid,private platform: Platform,
    private androidPermissions: AndroidPermissions,) { }

  ngOnInit() {
  }

  async ionViewDidEnter(){
    this.getData()
  }

  async getData(){
    await this.getUniqueDeviceID();
    await this.storage.get('email').then((val) => {
      this.email = val;
      console.log('Email :'+JSON.stringify(this.email))
    });
    if(this.email==null){
      this.router.navigateByUrl('/login');
    }else{
      this.router.navigateByUrl('/home-page');
    }
  }

  // async getPermission(){
  //   this.androidPermissions.checkPermission(
  //     this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //   ).then(res => {
  //     if(res.hasPermission){
  //       this.getData();
  //     }else{
  //       this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(res => {
  //         this.getUniqueDeviceID();
  //         this.permissionAlert("Scan Now!");
  //       }).catch(error => {
  //         alert("Error! "+error);
  //       });
  //     }
  //   }).catch(error => {
  //     alert("Error! "+error);
  //   });
  // }

  async permissionAlert(message) {
    let alert = await  this.alertCtrl.create({
      message: message,
      cssClass: 'alert-permissioncolor',
      buttons: [{
        text:'Ok',
        handler: () => {
        //   // navigator['app'].exitApp();
            window.location.reload();
        }
      }],
    });
    alert.present();
    let result =  alert.onDidDismiss();
    console.log(result);
  }
  async getUniqueDeviceID() {
    if(this.platform.is('android')){
      this.device_id = this.device.uuid;
      this.storage.set('device_id', this.device_id);
      console.log(this.device_id);
    } else if (this.platform.is("ios")){
      this.device_id = this.device.uuid;
      this.storage.set('device_id', this.device_id);
      console.log(this.device_id)
    }
  }
}
