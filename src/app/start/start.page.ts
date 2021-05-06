import { Component, OnInit } from '@angular/core';
import { NavController, ToastController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  exam_id:any;
  api_url:string="https://exam.nocortech.com/api/";
  // folder:any;
  exam_rule:string;
  data : any;
  email:any;
  constructor(
    private nav : NavController,
    private router: Router, 
    private storage: Storage,
    private http: HttpClient,
    public toastController: ToastController,) {
    
   }

  ngOnInit() {
    // this.getData();
    this.getExamRule();
  }

  // async getData(){
  //   this.folder = this.router.getCurrentNavigation().extras.state.folder;
  //   await this.storage.get('exam_id').then((val) => {
  //     this.exam_id = val;
  //     console.log('EXAM ID :'+JSON.stringify(this.exam_id))
  //   })
  // }
  
  start(){
    // let navigationExtras: NavigationExtras = {
    //   state: {
    //     exam_id:this.exam_id,
    //   }
    // }
    // this.router.navigate(['questionanswer'],navigationExtras);
    this.router.navigateByUrl('/questionanswer')
  }

  back(){
    this.router.navigateByUrl('/folder');
  }
  
  async getExamRule(){
    await this.storage.get('email').then((val) => {
      this.email = val
    });
    await this.storage.get('exam_id').then((val) => {
      this.exam_id = val
      console.log('exam_id :'+this.exam_id);
    });
    // this.api_url='https://exam.graylite.com/api/examrule';
    var formData : FormData = new FormData();
    formData.set('email',this.email);
    formData.set('exam_id',this.exam_id);
    this.http.post(this.api_url+'examrule',formData)
    .subscribe((response) => {
        this.data = response['data'];
        console.log(response['data']);
        console.log(this.data);
      
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
}
