import { Component, Inject ,OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { APP_CONFIG, AppConfig } from '../app.config';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.page.html',
  styleUrls: ['./home-page.page.scss'],
})
export class HomePagePage implements OnInit {

  constructor(@Inject(APP_CONFIG) public config: AppConfig, private route: Router ) { }

  ngOnInit() {
  }

  notification() {
    this.route.navigate(['./notification']);
  }
  change_language() {
    this.route.navigate(['./change-language']);
  }
  my_profile() {
    this.route.navigate(['./edit-profile']);
  }
}
