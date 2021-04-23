import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';

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
  myDate: String;
  data:[];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router, private platform: Platform,
              private storage: Storage, public toastController: ToastController,
              private http: HttpClient,
              private nav :NavController) { }

  ngOnInit() {
    // this.getExam();

  }
  ionViewWillEnter(){
    
    this.getExam();
  }

  ionViewDidEnter(){
    // this.storage.clear()
    this.subscription = this.platform.backButton.subscribeWithPriority(666666,()=>{
      if(this.constructor.name == "FolderPage"){
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

  async getExam(){
    // this.folder = this.activatedRoute.snapshot.paramMap.get('id');
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
    this.http.post('https://exam.graylite.com/api/exam',formData)
    .subscribe((response) => {
      this.data = response['data'];
      console.log(this.data);
    });
  }

  async sendExam(exam_id, start_time, end_time)
  {
    this.myDate = new Date().toLocaleString();
    console.log(this.myDate)
    await this.storage.set('exam_id', exam_id).then(()=>{
    if(start_time>=this.myDate || end_time<=this.myDate){
      this.presentToast('Waktu Tidak Valid!');
    }else{
      let navigationExtras: NavigationExtras = {
        state: {
          folder:this.folder
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

  LogOut(){
    this.storage.clear()
    .then(()=>
      this.router.navigateByUrl('/white-screen')
    );
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
  
}
