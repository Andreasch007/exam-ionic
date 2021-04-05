import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-questionanswer',
  templateUrl: './questionanswer.page.html',
  styleUrls: ['./questionanswer.page.scss'],
})
export class QuestionanswerPage implements OnInit {
exam_id:any;
email:any;
data:any;
  constructor(private router: Router,private http: HttpClient,private storage: Storage,) { }

  ngOnInit() {
    this.getData();
  }

  async getData(){
    this.exam_id = this.router.getCurrentNavigation().extras.state.exam_id;
    await this.storage.get('email').then((val) => {
      this.email = val;
      console.log('Email :'+JSON.stringify(this.email))
    });
    var formData : FormData = new FormData();
    formData.set('email', this.email);
    formData.set('exam_id', this.exam_id);
    this.http.post('https://exam.graylite.com/api/questionanswer',formData)
    .subscribe((response) => {
      this.data = response['data'];
      console.log(this.data);
    });
  }

}
