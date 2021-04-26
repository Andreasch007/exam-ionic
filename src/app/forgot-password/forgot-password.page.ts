import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  FormForgotPassword:FormGroup;
  email:string;
  password:string;
  api_url:string;
  compareWith : any ;

  constructor(public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
   
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,) {
         }

  ngOnInit() {
    this.getPassword();
    this.compareWith = this.compareWithFn;
  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  };

  async getPassword(){
   
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    await this.storage.get('password').then((val) => {
      this.password = val
    });
    var formData : FormData = new FormData();
    formData.set('email',this.email);
    this.http.post('https://exam.graylite.com/api/getpassword',formData)
    .subscribe((response) => {
      if(response['message']=='error'){
        this.presentToast(response['message']);
      } else { 
        this.email = response['data']['email'];
        this.password = response['data']['password'];
        console.log(response);
        console.log(this.password);
      }
    });
  }

  async savePassword(){
    this.api_url='https://exam.graylite.com/api/changePassword'
    var formData : FormData = new FormData();
    console.log('password', this.password);
    formData.set('email', this.email);
    formData.set('password',this.password);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();
      this.http.post(this.api_url, formData)
      .subscribe((response) => {
        this.presentToast(response['message']);
        loading.dismiss();
      },
      (error) => {
        alert(error);
      })
  }
  
  backPage(){
    this.router.navigateByUrl('/folder');
  }

  



  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }
}
