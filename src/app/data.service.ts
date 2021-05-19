import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public data : any;
  public exam_id : any;
  public email : any;
  url:string="https://exam.nocortech.com/api/";
  constructor(private http: HttpClient,private storage: Storage,) { }

  async load() {
    await this.storage.get('exam_id').then((val) => {
      this.exam_id = val;
      console.log('exam_id :'+JSON.stringify(this.exam_id))
    });
    await this.storage.get('email').then((val) => {
      this.email = val;
      console.log('Email :'+JSON.stringify(this.email))
    });
    if (this.data)
      return Promise.resolve(this.data);
    return new Promise(resolve => {
      var formData : FormData = new FormData();
      formData.set('email', this.email);
      formData.set('exam_id', this.exam_id);
      this.http.post(this.url+'questionanswer',formData).pipe(map((res :any) => res)).subscribe(data => {
        this.data = data;
        resolve(this.data);
        console.log('Question:'+this.data);
      });
    });
  }
}
