import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';



@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage {
  FormEditProfile:FormGroup;
  name:string;
  email:string;
  password:string;
  api_url:string="https://exam.nocortech.com/api/";
  UniqueDeviceID:string;
  company_data:any;
  company_id:string;
  compareWith : any ;

  constructor(public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
   
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,) {
         }

  async ngOnInit() {

    // this.company_id = "3";
    // this.compareWith = this.compareWithFn;
    
  }

  async ionViewWillEnter(){
    await this.getUserData();
  }

  // compareWithFn(o1, o2) {
  //   return o1 === o2;
  // };

  async getUserData(){
   
    await this.storage.get('device_id').then((val) => {
      this.UniqueDeviceID = val
    });
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    // this.getCompany(this.email);
    var formData : FormData = new FormData();
    formData.set('email',this.email);
    this.http.post(this.api_url+'edit-profile',formData)
    .subscribe((response) => {
      if(response['message']=='error'){
        this.presentToast(response['message']);
      } else { 
        this.name = response['data']['name'];
        this.company_id = response['data']['company_id'];
        console.log(response);
        console.log(this.name);
      }
    });
  }


  async saveEdit(){
    // this.api_url='https://exam.graylite.com/api/save-data'
    var formData : FormData = new FormData();
    console.log('company_id', this.company_id);
    formData.set('email', this.email);
    // formData.set('company_id',this.company_id);
    formData.set('name',this.name);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();
      this.http.post(this.api_url+'save-data', formData)
      .subscribe((response) => {
        this.presentToast(response['message']);
        loading.dismiss();
      },
      (error) => {
        alert(error);
      })
  }

  backPage(){
    this.router.navigateByUrl('/home-page');
  }

  public selectChange(event) {
    console.log("selectChange",event.detail.value);
    this.company_id = event.detail.value;
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

