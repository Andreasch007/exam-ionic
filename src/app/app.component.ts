import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    // { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    // { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    // { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    // { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    // { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    // { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  email:string;
  isLogin:number;
  category_id:number;
  // public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(private http: HttpClient,private storage: Storage,private router: Router,) {

    this.getCategory();
  }

  async getCategory(){
      await this.storage.get('email').then((val) => {
        this.email = val;
        console.log('Email :'+JSON.stringify(this.email))
      });
      if(this.email!=null){
        var formData : FormData = new FormData();
        formData.set('email', this.email);
        this.http.post('https://exam.graylite.com/api/category',formData)
        .subscribe((response) => {
          this.appPages = response['data'];
          console.log(this.appPages);
          console.log(this.category_id);
        });
      }  
  }

  doRefresh(event) {
    console.log('Begin async operation');
    this.getCategory();
    setTimeout(() => {
      console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
  }

  async sendCategory(id){
    // console.log(id);
    await this.storage.set('category_id',id);
  }
}
