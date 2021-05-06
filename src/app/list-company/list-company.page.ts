import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-list-company',
  templateUrl: './list-company.page.html',
  styleUrls: ['./list-company.page.scss'],
})
export class ListCompanyPage implements OnInit {
  fcompany_data:string;
  company_data:string;
  company_id:string;
  api_url:string="https://exam.nocortech.com/api/";
  email:string;
  name:string;

  constructor(public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
   
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,) {
         }
  ngOnInit() {
    this.getCompany();
    this.getFollowedCompany();
  }
  ionViewWillEnter(){
    
    
    // this.getFollowedCompany();
  }

  async getCompany(){
    
    // this.api_url='https://exam.graylite.com/api/company'
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    // console.log(this.email);
    var formData : FormData = new FormData();
    formData.set('email',this.email);
    this.http.post(this.api_url+'company',formData)
    .subscribe((response) => {
      if(response['message']=='error'){ 
        this.presentToast(response['message']);
      } else { 
        this.company_data = response['data'];
        // this.name = response['data']['name'];
        // this.company_id = response['data']['company_id'];
        console.log(this.company_data);
      }
      
    });
  }

  async getFollowedCompany(){
    
    // this.api_url='https://exam.graylite.com/api/getuserapproval'
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    // console.log(this.email);
    var formData : FormData = new FormData();
    formData.set('email',this.email);
    this.http.post(this.api_url+'getuserapproval',formData)
    .subscribe((response) => {
      if(response['message']=='error'){ 
        this.presentToast(response['message']);
      } else { 
        this.fcompany_data = response['data'];
        console.log(this.fcompany_data);
      }
      
    });
  }

  async sendCompany(company_id){
    // this.api_url='https://exam.graylite.com/api/sendapproval'
    
    await this.storage.get('email').then((val) => {
      this.email = val
    });

    var formData : FormData = new FormData();
    formData.set('email',this.email);
    formData.set('company_id',company_id);
    const loading = await this.loadingCtrl.create({
      message: 'Please wait...'
    });
    await loading.present();
    this.http.post(this.api_url+'sendapproval',formData)
    .subscribe((response) => {
      if(response['message']=='error'){ 
        this.presentToast(response['message']);
      } else { 
        this.presentToast('Data Sent Successfully');
        this.company_data = response['data'];
        console.log(this.company_data);
        loading.dismiss();

      }
      
    });

  }

  backPage(){
    this.router.navigateByUrl('/home-page');
  }
  
  doRefresh(event) {
    console.log('Begin async operation');
    this.getCompany();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
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
