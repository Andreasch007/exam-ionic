import { Component, OnInit } from '@angular/core';
import { NgZone } from '@angular/core';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { OneSignal } from '@ionic-native/onesignal/ngx';
import { Device } from '@ionic-native/device/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  FormLogin:FormGroup;
  showPasswordText:any;
  api_url:string="https://exam.nocortech.com/api/";
  dataLogin:any;
  playerID : string;
  subscription;
  device_id :any;
  constructor(private zone: NgZone, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    public toastController: ToastController,
    private storage: Storage,
    private platform: Platform,
    private router: Router,
    private oneSignal: OneSignal,
    private device : Device,) { }

  async ngOnInit() {
    
    this.FormLogin=this.formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });

  }

  ionViewDidEnter(){
    // this.storage.clear()
    this.getUniqueDeviceID();
    this.subscription = this.platform.backButton.subscribeWithPriority(666666,()=>{
      if(this.constructor.name == "LoginPage"){
        if(window.confirm("Do you want to exit app?"))
        {
          navigator['app'].exitApp();
        }
      }      
   // console.log('backbutton: '+JSON.parse(JSON.stringify(e)));
    });    
  } 
  ionViewWillLeave(){
    // this.nav.pop();
    this.subscription.unsubscribe();
  } 

  async login(){
    await this.oneSignal.getIds().then(identity => {
     this.playerID = identity.userId
      // alert(identity.userId + " It's Devices ID");
      console.log('playerID:'+this.playerID)
    });
    // await this.storage.get('device_id').then((val)=>{
    //   this.device_id = val;
    //   console.log('UID'+this.device_id)
    // })
    //menampilkan loading
    // await this.storage.get('playerID').then((val) => {
    //   // this.email = val;
    //   this.playerID = val;
    //   console.log('playerID :'+JSON.stringify(val))
    // });
    // this.api_url='https://exam.graylite.com/api/login';
    var formData : FormData = new FormData();
    formData.set('email', this.FormLogin.value['email']);
    formData.set('password',this.FormLogin.value['password']);
    formData.set('playerID',this.playerID);
    formData.set('uid',this.device_id);
    // formData.set('flag','0');
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present(); 
    // memanggil fungsi loginapi yang berada di service
    this.http.post(this.api_url+'login', formData)
    .subscribe((data) => {
      this.dataLogin=data;
      console.log(data);
      if(this.dataLogin.error==true){
        this.presentToast(this.dataLogin.message);
        console.log(this.dataLogin.message);
      }else{
        this.presentToast(this.dataLogin.message);
        console.log('email:'+this.dataLogin.data['email']);
        this.storage.set('isLogin', 1)
        this.storage.set('email', this.dataLogin.data['email'])
        // .then(() =>{
        //   if(this.dataLogin.data['company_id'] == null)
        //   {
        //     this.presentToast('Company must be filled !');
        //     this.router.navigateByUrl("/edit-profile");
        //   }
        //   else
        //   {
            this.router.navigateByUrl("/home-page")
        //   }
          
        // }, error =>{
        //   console.log(error);
        // })
      }
      loading.dismiss();
    },
    error => {
      let message='Tidak ada koneksi internet. Silakan periksa koneksi Anda.';
        this.presentToast(message);
        loading.dismiss();
    }  
    );
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

  async forgotPassword(){
    this.router.navigateByUrl("/forgot-password");
  }
  
  async register(){
    this.router.navigateByUrl("/register");
  }

  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }
  
  // async getData(email:string){
  //   console.log(email);
  //   this.api_url='https://nocortech.com/get_profile.php';
  //   var formData : FormData = new FormData();
  //   formData.set('email',email);
  //   this.http.post(this.api_url,formData)
  //   .subscribe((response) => {
  //       this.username = response['username'];
  //       this.phonenumber = response['phonenumber'];
  //       this.website = response['website'];
  //       this.isVerif = response['isverif'];
  //       console.log(this.username);
  //       console.log(this.phonenumber);
  //       console.log('isverif:'+this.isVerif);
  //       if(this.internalPath!=null){
  //         console.log('internalPath :'+this.internalPath)
  //         if(this.isVerif==1){
  //           // this.zone.run(() => {
  //             this.router.navigateByUrl("/absensi-checkin/:slug");
  //           // })
  //         }else {
  //           this.router.navigateByUrl("/otp-phonenumber");
  //         }
  //       }else{
  //         if(this.isVerif==1){
  //           this.router.navigateByUrl("/home");
  //         }else {
  //           this.router.navigateByUrl("/otp-phonenumber");
  //         }
  //       }
        
  //     });
  // }
}
