import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser'

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['./verification.page.scss'],
})
export class VerificationPage implements OnInit {
  FormVerification:FormGroup;
  data:string;
  email:string;
  api_url:string="https://exam.nocortech.com/api/";
  phonenumber:string;
  code:string;
  buttonClicked: boolean = false;

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

  async sendVerification(){
    
    // this.api_url='https://exam.graylite.com/api/company'
    await this.storage.get('email').then((val) => {
      this.email = val
    });

    var formData : FormData = new FormData();
    formData.set('email', this.email);
    formData.set('code',this.code);
    formData.set('phonenumber',this.phonenumber);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();
      this.http.post(this.api_url+'sendverification', formData)
      .subscribe((response) => {
        this.presentToast(response['message']);
        loading.dismiss();
        this.router.navigateByUrl('/home-page');
      },
      (error) => {
        let message='Kode yang anda masukkan salah.';
        this.presentToast(message);
        loading.dismiss();
      })
  }

  // moveFocus(event, nextElement, previousElement) {
  //   console.log(event.keyCode);
  //   console.log(event);
  //   if (event.keyCode == 8 && previousElement) {
  //     previousElement.setFocus();
  //   } else if (event.key == 'Unidentified' && event.keyCode == 229) {
  //     if (nextElement) {
  //       nextElement.setFocus();
  //     } 
  //   } else if (event.keyCode >= 96 && event.keyCode <= 105) {
  //     if (nextElement) {
  //       nextElement.setFocus();
  //     }
  //   } else {
  //     event.path[0].value = '';
  //   }
  // }

//   setFocus(nextElement) {
//     nextElement.setFocus(); //For Ionic 4
//    //nextElement.focus(); //older version
//  }
  
  async updatePhoneNumber(){
   
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    var formData : FormData = new FormData();
    formData.set('phonenumber',this.phonenumber);
    formData.set('email',this.email);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();
      this.http.post(this.api_url+'updatephonenumber', formData)
      .subscribe((response) => {
        this.presentToast(response['message']);
        loading.dismiss();
        this.buttonClicked = !this.buttonClicked;
      },
      (error) => {
        let message='Pastikan nomor handphone anda sudah benar.';
        this.presentToast(message);
        loading.dismiss();
      })
  }

  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }
 
  backPage(){
    this.router.navigateByUrl('/login');
  }
}
