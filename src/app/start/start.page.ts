import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-start',
  templateUrl: './start.page.html',
  styleUrls: ['./start.page.scss'],
})
export class StartPage implements OnInit {
  exam_id:any;

  folder:any;
  constructor(private nav : NavController,private router: Router, private storage: Storage,) {
    this.getData();
   }

  ngOnInit() {
  }

  async getData(){
    this.folder = this.router.getCurrentNavigation().extras.state.folder;
    await this.storage.get('exam_id').then((val) => {
      this.exam_id = val;
      console.log('EXAM ID :'+JSON.stringify(this.exam_id))
    });
   

  }

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
}
