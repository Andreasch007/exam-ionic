import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public data : any;
  public header_id : any;
  public email : any;
  url:string="https://exam.nocortech.com/api/";
  constructor(private http: HttpClient,private storage: Storage,) { }

  async load() {
    await this.storage.get('header_id').then((val) => {
      this.header_id = val;
      console.log('header_id :'+JSON.stringify(this.header_id))
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
      formData.set('header_id', this.header_id);
      this.http.post(this.url+'questionanswer',formData).pipe(map((res :any) => res)).subscribe(data => {
        this.data = data;
        resolve(this.data);
        console.log('Question:'+this.data);
      });
    });
  }
}
