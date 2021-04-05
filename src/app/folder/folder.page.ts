import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.page.html',
  styleUrls: ['./folder.page.scss'],
})
export class FolderPage implements OnInit {
  public folder: string;
  category_id:any;
  email:string;
  data:[];
  constructor(private activatedRoute: ActivatedRoute,
              private router: Router,
              private storage: Storage,
              private http: HttpClient) { }

  ngOnInit() {
    this.getExam();

  }

  async getExam(){
    this.folder = this.activatedRoute.snapshot.paramMap.get('id');
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

  sendExam(exam_id){
    let navigationExtras: NavigationExtras = {
      state: {
        exam_id:exam_id

      }
    }
    this.router.navigate(['questionanswer'],navigationExtras);
  }

  LogOut(){
    this.storage.clear()
    .then(()=>
      this.router.navigateByUrl('/white-screen')
    );
  }
  
}
