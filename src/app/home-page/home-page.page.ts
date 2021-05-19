import { Component, Inject ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavController, AlertController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {
  subscription;
  email:string;
  name:string;
  api_url:string="https://exam.nocortech.com/api/";
  constructor( private route: Router, private platform: Platform, private http: HttpClient,private storage: Storage,) { }

  ngOnInit() {
  
  }

  async ionViewWillEnter(){
   await this.getUserData();
  }

  ionViewDidEnter(){
    // this.storage.clear()
    this.subscription = this.platform.backButton.subscribeWithPriority(666666,()=>{
      if(this.constructor.name == "HomePagePage"){
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


  async getUserData(){
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    // this.getCompany(this.email);
    var formData : FormData = new FormData();
    formData.set('email',this.email);
    this.http.post(this.api_url+'edit-profile',formData)
    .subscribe((response) => {
        this.name = response['data']['name'];
        console.log(this.name);
    });
  }
  
  my_profile() {
    this.route.navigate(['./edit-profile']);
  }

  goExam(){
    this.route.navigate(['./folder']);
  }

  goCompany(){
    this.route.navigate(['./list-company']);
  }

  LogOut(){
    this.storage.clear()
    .then(()=>
      this.route.navigateByUrl('/login')
    );
  }


}
