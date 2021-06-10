import { Component, OnInit } from '@angular/core';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx';
import { NavController, AlertController } from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Storage } from '@ionic/storage';

var latitude;
var longitude;
declare var WifiWizard2: any;
@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.page.html',
  styleUrls: ['./scan-qrcode.page.scss'],
})

export class ScanQrcodePage implements OnInit {
  options: BarcodeScannerOptions;
  ssid_e :any;
  device_id : any;
  ip_address :any;
  devicename: string;
  devicetype: string;
  hasPermission : boolean=true;
  isEnabled: boolean = false;
  isRestart: boolean=false;
  constructor(private scanner : BarcodeScanner,private androidPermissions: AndroidPermissions,
              private device: Device, private alertCtrl: AlertController,
              private platform: Platform,private networkInterface: NetworkInterface,
              public geolocation: Geolocation,
              private storage: Storage,) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.getPermissionMobile();
    console.log('version : '+this.device.version);
  }

  async scanBarcode() {
    this.getDeviceInfo();
    this.options= {
      prompt: '',
      resultDisplayDuration: 0.5
    }
    this.scanner.scan(this.options).then((barcodeData) => {
      if(barcodeData.cancelled){
        //exit
        // navigator['app'].exitApp();
          // this.nav.pop;
        return;
      }
    });
 }

 async getPermissionMobile(){
  this.androidPermissions.checkPermission(
    this.androidPermissions.PERMISSION.READ_PHONE_STATE
  ).then( res => {
    if(res.hasPermission){
      this.scanBarcode();
    }else{
      this.androidPermissions.requestPermission(
        this.androidPermissions.PERMISSION.READ_PHONE_STATE
        ).then( res => {
        this.getDeviceInfo();
        this.permissionAlert("Scan Now!");
      }).catch(error => {
        alert("Error : "+error);
      });
    }
  }).catch(error => {
    alert("Error! "+error);
  });
}

async getDeviceInfo(){
  await this.storage.get('device_id').then(data => {
    this.device_id = data;
  });
  this.devicetype = this.device.platform;
  console.log('devicetype: ', this.devicetype);
  this.devicename = this.device.model;
  console.log('devicename: ', this.devicename);
  if(this.platform.is("android")){
   await WifiWizard2.isWifiEnabled (
    this.isEnabled = true,
    WifiWizard2.getConnectedSSID()
      .then(ssid => {
        this.ssid_e = ssid
        console.log('ssid_e: ', this.ssid_e);
      })
      .catch(error => console.error(error)),
    );
    } else if (this.platform.is("ios")){
      WifiWizard2.isWifiEnabled (
      this.ssid_e = '',
      this.isEnabled = true,
      );
    }
    if(this.isEnabled==true){
      await this.networkInterface.getWiFiIPAddress()
      .then(address => this.ip_address=address.ip)
      .catch(error => console.error(`Unable to get IP: ${error}`));
    } else {
      await this.networkInterface.getCarrierIPAddress()
      .then(address => this.ip_address=address.ip)
      .catch(error => console.error(`Unable to get IP: ${error}`));
    }
    console.log(this.ip_address);
  await this.geolocation.getCurrentPosition().then((resp) => {
    latitude = resp.coords.latitude;
    console.log('latitude: ', latitude);
    longitude = resp.coords.longitude;
    console.log('longitude: ', longitude);
  }).catch((error) => {
    console.log('Error getting location', error);
  });
  this.isRestart=true;
}

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

}
