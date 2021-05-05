import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HomePagePage } from './home-page.page';
// import { AppComponent } from './app.component';

describe('HomePagePage', () => {
  let component: HomePagePage;
  let fixture: ComponentFixture<HomePagePage>;
  
  
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
