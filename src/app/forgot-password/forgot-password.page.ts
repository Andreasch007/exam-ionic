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

  }

  compareWithFn(o1, o2) {
    return o1 === o2;
  };

  // async getPassword(){
   
  //   await this.storage.get('email').then((val) => {
  //     this.email = val
  //   });
  //   await this.storage.get('password').then((val) => {
  //     this.password = val
  //   });
  //   var formData : FormData = new FormData();
  //   formData.set('email',this.email);
  //   this.http.post('https://exam.graylite.com/api/getpassword',formData)
  //   .subscribe((response) => {
  //     if(response['message']=='error'){
  //       this.presentToast(response['message']);
  //     } else { 
  //       this.email = response['data']['email'];
  //       this.password = response['data']['password'];
  //       console.log(response);
  //       console.log(this.password);
  //     }
  //   });
  // }

  async getPassword(){
    var formData : FormData = new FormData();
    // console.log('password', this.password);
    await this.storage.get('email').then((val)=>{
      this.email = val;
    })
    this.api_url='https://exam.graylite.com/api/changepassword'
    // formData.set('password',this.password);
    var formData : FormData = new FormData();
    formData.set('email', this.FormForgotPassword.value['email']);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    
  }
  
  backPage(){
    this.router.navigateByUrl('/folder');
  }

  backtoLogin(){
    this.router.navigateByUrl('/login');
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
