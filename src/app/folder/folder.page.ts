import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import * as moment from 'moment';
import { interval } from 'rxjs';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  category_id:any;
  subscription;
  email:string;
  myDate: any;
  data:[];
  tab: string = "upcoming_test";
  start_time : any;
  bool : number;
  api_url:string="https://exam.nocortech.com/api/";
  constructor(private activatedRoute: ActivatedRoute,
              public loadingCtrl: LoadingController,
              private router: Router, private platform: Platform,
              private storage: Storage, public toastController: ToastController,
              private http: HttpClient,
              private route: Router,
              private nav :NavController) {
                // setInterval(()=>this.getExam(),1000)
              }

  ngOnInit() {
    // this.getExam();
    
  }
  ionViewWillEnter(){
    
    this.getExam();
  }

  // ionViewDidEnter(){
  //   // this.storage.clear()
  //   this.subscription = this.platform.backButton.subscribeWithPriority(666666,()=>{
  //     if(this.constructor.name == "FolderPage"){
  //       if(window.confirm("Do you want to exit app?"))
  //       {
  //         navigator['app'].exitApp();
  //       }
  //     }      
  //  // console.log('backbutton: '+JSON.parse(JSON.stringify(e)));
  //   });    
  // } 
  // ionViewWillLeave(){
  //   // this.nav.pop();
  //   this.subscription.unsubscribe();
  // } 

  async getExam(){
    // this.folder = this.activatedRoute.snapshot.paramMap.get('id');
    var now = moment();
    this.myDate = moment(now.format(),moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss');
    await this.storage.get('email').then((val) => {
      this.email = val;
      console.log('Email :'+JSON.stringify(this.email))
    });
    await this.storage.get('category_id').then((val) => {
      this.category_id = val;
      console.log('Category ID :'+JSON.stringify(this.category_id))
    });
    console.log(this.folder);
    var formData : FormData = new FormData();
    formData.set('email', this.email);
    formData.set('category_id', this.category_id);
    this.http.post(this.api_url+'exam',formData)
    .subscribe((response) => {
      this.data = response['data'];
      console.log(this.data);
      // console.log(this.start_time);
    });
  }
  
  async sendExam(header_id, start_time, end_time)
  {
    var now = moment();
    this.myDate = moment(now.format(),moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss');
    let diff = moment(end_time,'YYYY-MM-DD HH:mm:ss').diff(moment(start_time,'YYYY-MM-DD HH:mm:ss'),'minutes')
    console.log(start_time)
    console.log(this.myDate);
    await this.storage.set('difftime',diff)
    await this.storage.set('start_time',start_time)
    await this.storage.set('header_id', header_id).then(()=>{
    if(start_time>this.myDate || end_time<this.myDate){
      this.presentToast('Waktu Tidak Valid!');
    }else{
      let navigationExtras: NavigationExtras = {
        state: {
          folder : this.folder
        }
    }
    this.router.navigate(['start'],navigationExtras);
    }
    });
  }

  async presentToast(Message) {
    const toast = await this.toastController.create({
      message: Message,
      duration: 2500,
      position: "bottom"
    });
    toast.present();
  }

  companyList(){
    this.router.navigateByUrl('/list-company');
  }

  EditProfile() {
    this.router.navigateByUrl('/edit-profile');
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getExam();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }
  
  backPage(){
    this.route.navigateByUrl('/home-page');
  }
}
