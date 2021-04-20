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
  data:[];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router, private platform: Platform,
              private storage: Storage,
              private http: HttpClient,
              private nav :NavController) { }

  ngOnInit() {
    this.getExam();

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

  async sendExam(exam_id){
    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     exam_id:exam_id,
    //     folder:this.folder
    //   }
    // }
    // this.router.navigate(['start'],navigationExtras);
    await this.storage.set('exam_id', exam_id).then(()=>{
      let navigationExtras: NavigationExtras = {
      state: {
        folder:this.folder
      }
    }
    this.router.navigate(['start'],navigationExtras);
    });
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
