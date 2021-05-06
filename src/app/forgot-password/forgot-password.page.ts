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
  api_url:string="https://exam.nocortech.com/api/";
  ResponseEmail : any;

  constructor(public loadingCtrl: LoadingController,
    private alertController: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
   
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,) {
         }

  ngOnInit() {
    this.FormForgotPassword=this.formBuilder.group({
      email:['',Validators.required]
    });
  }

  async getPassword(){
    
    // this.api_url='https://exam.graylite.com/api/forgotpassword'
    var formData : FormData = new FormData();
    formData.set('email', this.FormForgotPassword.value['email']);

    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present(); 
    console.log(this.FormForgotPassword.value['email']);

    this.http.post(this.api_url+'forgotpassword', formData)
    .subscribe((data) => {
      // this.hideLoading();
      this.ResponseEmail=data;
      console.log(data);
      
      if(this.ResponseEmail.error==true){
        this.AlertEmail(this.ResponseEmail.message);
        loading.dismiss();
        // console.log(this.ResponseRegister.error);
        
      }else{
        loading.dismiss();
        this.AlertSuccess(this.ResponseEmail.message);
       
      }
      loading.dismiss();
    },
    (error) => {
      this.AlertEmail('Please enter your email address !');
      loading.dismiss();
    });
  }


  backtoLogin(){
    this.router.navigateByUrl('/login');
  }

  async AlertEmail(Message) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      //subHeader: 'Subtitle',
      message: Message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async AlertSuccess(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [{
        text: 'Check Your Email for Inbox',
        handler: () =>{
            this.backtoLogin();
        }
      }],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
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
