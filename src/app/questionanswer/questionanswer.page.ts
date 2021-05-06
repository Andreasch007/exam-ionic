import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { DataService } from '../data.service';
import { NavController, AlertController, Platform,ToastController } from '@ionic/angular';
import * as moment from 'moment';


@Component({
  selector: 'app-questionanswer',
  templateUrl: './questionanswer.page.html',
  styleUrls: ['./questionanswer.page.scss'],
})
export class QuestionanswerPage implements OnInit {
  @ViewChild('slides') slides: any;

  public hasAnswered : boolean = false;
  public score : number = 0;
  myDate: any;
  public slideOptions : any;
  public questions : any;
  public originalOrder : any;
  flashCardFlipped: boolean = false;
  exam_id:any;
  email:any;
  subscription;
  data:any;
  // currentQuestion = {};
  questionCounter = 0;
  availableQuesions = [];
  answer_text :string;
  answer_id: string;
  selectedRadioGroup: any;
  MAX_QUESTIONS = 3
  lengthSlide : any;
  currentSlide: any;
  length_question:any;
  currentQuestion:any=1;
  diffTime :any;
  diffTime2 :any;
  start_time :any;
  limitTime :any;
  api_url:string="https://exam.nocortech.com/api/";
  constructor(private router: Router,private http: HttpClient,
              private storage: Storage, public dataService: DataService,public toastController: ToastController,
              private platform: Platform,  private alertCtrl: AlertController,) {      
                setInterval(() => {
                    this.getTime(),1000}); 
                  if(this.limitTime<=0){
                    clearInterval();
                  }  }

  async ngOnInit() {
    // this.getData();



    
  }

  // ionViewWillEnter(){
  //   this.getData();
  // }

   async getTime(){
    await this.storage.get('difftime').then((time) => {
      this.diffTime = time;
      console.log(this.diffTime)
    });
    await this.storage.get('start_time').then((time) => {
      this.start_time = time;
      console.log(this.start_time)
    });
    var now = moment();
    this.myDate = moment(now.format(),moment.ISO_8601).format('YYYY-MM-DD HH:mm:ss');
    this.diffTime2 = moment(this.myDate).diff(moment(this.start_time,'YYYY-MM-DD HH:mm:ss'),'minutes')
    this.limitTime = this.diffTime-this.diffTime2;
    console.log('limit Time :'+this.limitTime);
   }

  async ionViewWillEnter() {
    this.slides.lockSwipes(true);
   
    await this.storage.get('email').then((val) => {
      this.email = val;
      console.log('Email :'+JSON.stringify(this.email))
    });
    this.dataService.load().then((data) => {
      data.map((question) => {
        //  this.originalOrder = question.answer;
        // question.answer = this.randomizeAnswers(originalOrder);
        return question;
      });
      this.questions = data;
      this.originalOrder = this.questions;
      this.originalOrder.forEach(element => {
      if(element.question_type=="check"){
          element.answer.forEach(element2 => {
            element2.isChecked = false;
          })
        }
      });
      this.length_question = this.questions.length;
      console.log(this.questions.length);
      console.log(this.originalOrder);
      console.log(this.questions.answer)
    });
  }
  

  ionViewDidEnter(){
    // this.storage.clear()
    this.subscription = this.platform.backButton.subscribeWithPriority(666666,()=>{
      if(this.constructor.name == "MainPagePage"){
        // if(window.confirm("Do you want to exit app?"))
        // {
        //   navigator['app'].exitApp();
        // }
        window.confirm('Cant Back!');
      }      
   // console.log('backbutton: '+JSON.parse(JSON.stringify(e)));
    });    
  } 

  ionViewWillLeave(){
    // this.nav.pop();
    this.subscription.unsubscribe();
    
  } 

  async nextSlide(question) {
    var formData : FormData = new FormData();
    var formData2 : FormData = new FormData();
    formData.set('email',this.email);
    formData.set('exam_id',question.exam_id);
    formData2.set('email',this.email);
    formData2.set('exam_id',question.exam_id);
    if(question.question_type == 'check'){
      formData.set('question_type',question.question_type);
      formData.set('question_id', question.question_id);
       this.originalOrder.forEach(element => {
        var currIndex = 0;
        element.answer.forEach(element2 => {
        if(element2.isChecked){  
          formData.set('answer['+currIndex+']',element2.answer_id);        
          formData.set('result['+currIndex+']','true');
          console.log('checked :'+element2.answer_val)
          // console.log('email :'+this.email)
          // console.log('Question ID :'+element.question_id)
          // console.log('exam ID :'+element.exam_id)
        currIndex++;
        }
        });
    });
    } else if(question.question_type == 'radio') {
      formData.set('question_type',question.question_type);
      formData.set('question_id',question.question_id);
      formData.set('answer', this.selectedRadioGroup);
      formData.set('result', "true");
    } else if(question.question_type == 'text'){
      this.answer_id = (<HTMLInputElement>document.getElementById('input-id')).value;
      console.log(this.answer_id)
      formData.set('question_type',question.question_type);
      formData.set('question_id',question.question_id);
      formData.set('answer', this.answer_id);
      if(this.answer_text=='' || this.answer_text==null){
        this.presentToast('Invalid Input');
      }else{
        formData.set('result', this.answer_text);
      }
    }
    
    // this.currentSlide = 0;
    await this.slides.getActiveIndex().then((index) =>{
      this.currentSlide = index+1;
      console.log('index:'+index);
      // console.log('exam_id',question.exam_id);
    })
    await this.slides.length().then((index)=>{
      this.lengthSlide = index;
      console.log('index:'+index);
    })
    if(this.lengthSlide==this.currentSlide){
      formData2.set('flag','1')
    } else {
      formData2.set('flag','0')
    }
    if(this.limitTime>0){
    this.http.post(this.api_url+'updatejournal', formData).subscribe((response) => {
      this.slides.lockSwipes(false);
      if(this.lengthSlide==this.currentSlide){
        this.http.post(this.api_url+'updateflagdone', formData2).subscribe(()=>{
          this.presentAlertSuccess('Thank You !');
        })
      } else {
        this.currentQuestion++;
        this.slides.slideNext();
      }

      this.slides.lockSwipes(true);
    });
    }else{
      this.http.post(this.api_url+'updateflagdone', formData2).subscribe((response) => {
        this.presentAlertTimeUp('Time`s up!');
      });
    }
  }

  public radioGroupChange(event) {
    console.log("radioGroupChange",event.detail.value);
    this.selectedRadioGroup = event.detail.value;
    }

  async backSlide(question) {
   await this.slides.getActiveIndex().then((index) =>{
      this.currentSlide = index--;
      if(this.currentSlide!=0){
        this.currentQuestion--;
        console.log(this.currentQuestion)
      }
    })

    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  public selectAnswer(answer, question) {
    console.log(answer);
    console.log(question);
    this.hasAnswered = true;
    answer.selected = true;
    question.flashCardFlipped = true;

    if (answer.correct)
      this.score++;

    setTimeout(() => {
      this.hasAnswered = false;
      // this.nextSlide();
      answer.selected = false;
      question.flashCardFlipped = false;
    }, 3000);
  }

  async presentAlertSuccess(message) {
    const alert = await this.alertCtrl.create({
      message: `<img class="image-success" src="../../assets/images/success.png" alt="success"></img>
      <p class="text-success">`+message+`</p>`,
      cssClass: 'alert-colorsuccess-1',
      buttons: [{
        text: 'Ok',
        handler: () =>{
            this.router.navigateByUrl('folder');
        }
      }],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
  }

  async presentAlertTimeUp(message) {
    const alert = await this.alertCtrl.create({
      message: message,
      // cssClass: 'alert-colorsuccess-1',
      buttons: [{
        text: 'Ok',
        handler: () =>{
            this.router.navigateByUrl('folder');
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

  // public randomizeAnswers(rawAnswers: any[]): any[] {
  //   for (let i = rawAnswers.length - 1; i > 0; i--) {
  //     let j = Math.floor(Math.random() * (i + 1));
  //     let temp = rawAnswers[i];
  //     rawAnswers[i] = rawAnswers[j];
  //     rawAnswers[j] = temp;
  //   }

  //   return rawAnswers;
  // }

  // async getData(){
  //   // this.exam_id = this.router.getCurrentNavigation().extras.state.exam_id;
  //   await this.storage.get('exam_id').then((val) => {
  //     this.exam_id = val;
  //     console.log('exam_id :'+JSON.stringify(this.exam_id))
  //   });
  //   await this.storage.get('email').then((val) => {
  //     this.email = val;
  //     console.log('Email :'+JSON.stringify(this.email))
  //   });
  //   var formData : FormData = new FormData();
  //   formData.set('email', this.email);
  //   formData.set('exam_id', this.exam_id);
  //  this.http.post('https://exam.graylite.com/api/questionanswer',formData)
  //   .subscribe((response) => {
  //     this.data = response;
  //     console.log(this.data);
  //   });
  // }

 

}
