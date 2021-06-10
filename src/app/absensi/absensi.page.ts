import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner/ngx';
import { Device } from '@ionic-native/device/ngx';
import { NetworkInterface } from '@ionic-native/network-interface/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';

var latitude;
var longitude;
declare var WifiWizard2: any;
@Component({
  selector: 'app-absensi',
  templateUrl: './absensi.page.html',
  styleUrls: ['./absensi.page.scss'],
})
export class AbsensiPage implements OnInit {
  options: BarcodeScannerOptions;
  ssid_e :any;
  device_id : any;
  ip_address :any;
  devicename: string;
  devicetype: string;
  hasPermission : boolean=false;
  isEnabled: boolean = false;
  isRestart: boolean=false;
  email:string;
  form_name : string;
  id : any;
  loading: any =null;
  url : any;
  data_company: any;
  company_id : any;
  api_url:string="https://exam.nocortech.com/api/";
  isLoading: boolean = false;

  constructor(private route: Router,private scanner : BarcodeScanner,private androidPermissions: AndroidPermissions,
    private device: Device, private alertCtrl: AlertController,
    private platform: Platform,private networkInterface: NetworkInterface,
    public geolocation: Geolocation,
    private storage: Storage,private http: HttpClient,
    private nav : NavController,
    public loadingCtrl: LoadingController,) { }

  ngOnInit() {
    // this.getPermissionMobile();
    this.getDeviceInfo();
  }

  backPage(){
    this.route.navigateByUrl('/home-page');
  }

  goCheckIn(){
    // this.route.navigateByUrl('/scan-qrcode');
    this.form_name='Check In'
    this.scanBarcode();
    
  }

  goCheckOut(){
    this.form_name='Check Out'
    this.scanBarcode();
  }

  // async getPermissionMobile(){
  //   this.androidPermissions.checkPermission(
  //     this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //   ).then( res => {
  //     if(res.hasPermission){
  //       // this.scanBarcode();
  //       this.hasPermission=true;
  //     }else{
  //       this.androidPermissions.requestPermission(
  //         this.androidPermissions.PERMISSION.READ_PHONE_STATE
  //         ).then( res => {
  //         this.getDeviceInfo();
  //         this.permissionAlert("Scan Now!");
  //       }).catch(error => {
  //         alert("Error : "+error);
  //       });
  //     }
  //   }).catch(error => {
  //     alert("Error! "+error);
  //   });
  // }

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
      this.id = JSON.parse(barcodeData.text)['CompanyID'];
      console.log("CompanyID :" +this.id);
      var formData : FormData = new FormData();
      formData.set('infoDevice[device_id]',this.device_id);
      formData.set('infoDevice[device_name]',this.devicename);
      formData.set('infoDevice[device_type]',this.devicetype);
      formData.set('infoDevice[ip_address]',this.ip_address);
      formData.set('infoDevice[ssid_id]', this.ssid_e);
      formData.set('infoDevice[latitude]',latitude);
      formData.set('infoDevice[longitude]',longitude);
      formData.set('infoDevice[email]', this.email);
      // formData.set('infoDevice[user]', this.userName);
      // formData.set('infoDevice[playerId]', this.playerId);
      // formData.set('infoDevice[device_token]', this.deviceToken);
      formData.set('form[id]', this.id);
      // formData.set('form[remark]', this.remark);
      formData.set('form[name]',this.form_name);
      this.presentLoading();
      this.http.post(this.url!=null? this.url:'https://exam.nocortech.com/api/send', formData)
      .subscribe((response) => {
       this.hideLoading();
      //  console.log('response: '+response);
      //  console.log('response: '+response['id']);
      if(response['error']==true){
        this.presentAlertFailed(response['message']);
        console.log('response: '+response['message']);
      }else{
        this.presentAlertSuccess('Thank You !');
      }
        // if(this.form_method==0 || (this.form_method==0 && response==null)){
        //   this.presentAlertSuccess('Thank You !');
        // }else if(this.form_method==1 && response['message']!='' && (response['id']==null || response['id']=='')){
        //   if(response['icon']=='success'){
        //     this.presentAlertSuccess(response['message']);
        //     console.log(response['message']);
        //     console.log('is_success'+response['icon']);
        //   }else if(response['icon']=='fail'){
        //     this.presentAlertFailed(response['message']);
        //     console.log('icon'+response['icon']);
        //   }else{
        //     this.presentAlertSuccess(response['message']);
        //   }
        // }
      }, error => {
        this.hideLoading();
       this.presentAlertFailed('URL Not Valid!');
      });
    });
 }

 async getCompany(){
  await this.storage.get('email').then(data => {
    this.email = data;
    console.log('email:'+this.email)
  });
  var formData : FormData = new FormData();
  formData.set('email',this.email);
  this.http.post(this.api_url+'company',formData)
  .subscribe((response) => {
    // this.data_company=response;
      this.url = response['data']['link'];
      // this.name = response['data']['name'];
      // this.company_id = response['data']['company_id'];
      console.log(this.url);
    
  });
}

 async getDeviceInfo(){
  await this.storage.get('device_id').then(data => {
    this.device_id = data;
    console.log('device_id:'+this.device_id)
  });
  this.getCompany();
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

async presentLoading() {
  this.isLoading = true;
    this.loading = await this.loadingCtrl.create({
      message: 'Please wait...',
      duration: 4000
    }).then(loader => {
      loader.present().then(() => {
        if(!this.isLoading){
          loader.dismiss();
        }
      })
    });
}
async hideLoading() {
  this.isLoading = false;
  this.loadingCtrl.getTop().then(loader =>{
    if(loader){
      loader.dismiss();
    }
  })
}

async presentAlertSuccess(message) {
  const alert = await this.alertCtrl.create({
    message: `<img class="image-success" src="../../assets/success.png" alt="success"></img>
    <p class="text-success">`+message+`</p>`,
    cssClass: 'alert-colorsuccess-0',
    buttons: [{
      text: 'Ok',
      handler: () =>{
          this.nav.pop();
      }
    }],
  });
  await alert.present();
  let result = await alert.onDidDismiss();
  console.log(result);
}

async presentAlertFailed(message) {
const alert = await this.alertCtrl.create({
  message: `<img class="image-failed" src="../../assets/failed.png" alt="failed"></img>
  <p class="text-failed">`+message+`</p>`,
  cssClass: 'alert-failedcolor',
  buttons: [{
    text: 'Ok',
    handler: () =>{
        this.nav.pop();
    }
  }],
});
await alert.present();
let result = await alert.onDidDismiss();
console.log(result);
}

}
