import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';
import { Uid } from '@ionic-native/uid/ngx';
import { Storage } from '@ionic/storage';
import { Device } from '@ionic-native/device/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';

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
  api_url:string;
  UniqueDeviceID:string;

  constructor(public loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private formBuilder: FormBuilder, 
    private http: HttpClient,
    private uniqueDeviceID: UniqueDeviceID,
    private uid: Uid,
    private androidPermissions: AndroidPermissions,
    public toastController: ToastController,
    private storage: Storage,
    private router: Router,) {
      this.getPermission();
      this.getUserData();
         }

  async ngOnInit() {
    // this.FormEditProfile=this.formBuilder.group({
    //   name:['',Validators.required],
    //   email:['',Validators.required],
    //   password:['',Validators.required]
    // });
  }
  getUniqueDeviceID() {
    this.uniqueDeviceID.get()
      .then((uuid: any) => {
        console.log(uuid);
        this.UniqueDeviceID = uuid;
      })
      .catch((error: any) => {
        console.log(error);
        this.UniqueDeviceID = "Error! ${error}";
      });
  }

  getPermission(){
    this.androidPermissions.checkPermission(
      this.androidPermissions.PERMISSION.READ_PHONE_STATE
    ).then(res => {
      if(res.hasPermission){
        
      }else{
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.READ_PHONE_STATE).then(res => {
          alert("Permission Granted Please Restart App!");
        }).catch(error => {
          alert("Error! "+error);
        });
      }
    }).catch(error => {
      alert("Error! "+error);
    });
  }

  async getUserData(){
    // this.storage.get('phonenumber').then((val) => {
    //   this.phoneNumber = val
    // });
    this.api_url='https://exam.graylite.com/api/edit-profile'
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    var formData : FormData = new FormData();
    formData.set('email',this.email);
    this.http.post(this.api_url,formData)
    .subscribe((response) => {
      if(response['message']=='error'){
        this.presentToast(response['message']);
      } else { 
        this.name = response['name'];
        this.email = response['email'];
        this.password = response['password'];
        this.UniqueDeviceID = response['UniqueDeviceID'];
      }
    });
    // if(this.platform.is('android')){
    //   this.device_id = this.device.uuid;
    //   console.log(this.device_id);
    // } else if (this.platform.is("ios")){
    //   this.device_id = this.device.uuid;
    //   console.log(this.device_id)
    // }
  }


  async saveEdit(){
    this.api_url='https://exam.graylite.com/api/save-data'
    var formData : FormData = new FormData();
    formData.set('name',this.name);
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
    this.router.navigateByUrl('/main-page');
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

