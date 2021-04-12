import { Component, OnInit } from '@angular/core';
import { NgZone } from '@angular/core';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule  } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  FormLogin:FormGroup;
  showPasswordText:any;
  api_url:string;
  dataLogin:any;
  constructor(private zone: NgZone, public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,) { }

  async ngOnInit() {
    this.FormLogin=this.formBuilder.group({
      email:['',Validators.required],
      password:['',Validators.required]
    });

  }

  async login(){
    //menampilkan loading
    this.api_url='https://exam.graylite.com/api/login';
    var formData : FormData = new FormData();
    formData.set('email', this.FormLogin.value['email']);
    formData.set('password',this.FormLogin.value['password']);
    // formData.set('flag','0');
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present(); 
    // memanggil fungsi loginapi yang berada di service
    this.http.post(this.api_url, formData)
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
        .then(() =>{
          this.router.navigateByUrl("/folder")
        }, error =>{
          console.log(error);
        })
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
