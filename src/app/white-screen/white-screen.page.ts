import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-white-screen',
  templateUrl: './white-screen.page.html',
  styleUrls: ['./white-screen.page.scss'],
})
export class WhiteScreenPage implements OnInit {
  email:string;
  constructor(private storage: Storage,private router: Router,) { }

  ngOnInit() {
    this.getData(); 
  }

  async getData(){
    await this.storage.get('email').then((val) => {
      this.email = val;
      console.log('Email :'+JSON.stringify(this.email))
    });
    if(this.email==null){
      this.router.navigateByUrl('/login');
    }else{
      this.router.navigateByUrl('/folder/Home');
    }
  }
}
