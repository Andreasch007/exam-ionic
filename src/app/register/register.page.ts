import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { NavController, LoadingController, ToastController, Platform, ModalController, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  showPasswordText:any;
  showKonfirmPasswordText:any;

  validations = {
    'name': [
      { type: 'required', message: 'Name harus diisi.' },
    ],
    'email': [
      { type: 'required', message: 'Email harus diisi.' },
      { type: 'pattern', message: 'Email tidak valid.' },
    ],
    'password': [
      { type: 'required', message: 'Password harus diisi.' },
      { type: 'minlength', message: 'Password minimal harus 5 karakter.' },
      { type: 'pattern', message: 'Password harus mengandung huruf (baik huruf besar dan kecil) dan angka.' },
    ],  
    'confirmpass': [
      { type: 'confirm', message: 'Password tidak sama' },
    ]
  };

  FormRegister: FormGroup;
  ResponseRegister:any;
  api_url:string;

  constructor(
    private formBuilder: FormBuilder, 
    private navCtrl: NavController, 
    public loadingController: LoadingController,
    private platform: Platform,
    public toastController: ToastController,
    public alertController: AlertController,
    public modalController: ModalController,
    private router: Router,
    private http: HttpClient,
    private nav : NavController,) { }

  ngOnInit() {
    this.FormRegister = this.formBuilder.group({
      name:new FormControl('', Validators.compose([
        Validators.required,
        // Validators.pattern('^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')
      ])),
      email:new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[\\w]+(?:\\.[\\w])*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$')
      ])),
      password:new FormControl('', Validators.compose([
        Validators.required, 
        Validators.minLength(5),
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])),
      confirmpass:new FormControl('', Validators.compose([
        Validators.required, 
        // Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$')
      ])), 
    }, {validator: this.matchingPasswords('password', 'confirmpass')
    });
  }

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    // TODO maybe use this https://github.com/yuyang041060120/ng2-validation#notequalto-1
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls[passwordKey];
      let confirmpass = group.controls[confirmPasswordKey];

      if (password.value !== confirmpass.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  async Register(){
    //menampilkan loading
    this.api_url='https://exam.graylite.com/api/register';
    var formData : FormData = new FormData();
    formData.set('name', this.FormRegister.value['name']);
    formData.set('email', this.FormRegister.value['email']);
    formData.set('password',this.FormRegister.value['password']);
    formData.set('c_password',this.FormRegister.value['confirmpass']);
    const loading = await this.loadingController.create({
      message: 'Please wait...'
    });
    await loading.present(); 
    //panggil fungsi register di service
    console.log(this.FormRegister.value);
    this.http.post(this.api_url, formData)
    .subscribe((data) => {
      // this.hideLoading();
      this.ResponseRegister=data;
      console.log(data);
      //cek apakah register berhasil atau tidak
      if(this.ResponseRegister.error==true){
        this.AlertRegister(this.ResponseRegister.message);
        loading.dismiss();
        // console.log(this.ResponseRegister.error);
        
      }else{
        loading.dismiss();
        this.AlertSuccess(this.ResponseRegister.message);
       
      }
      loading.dismiss();
    },
    (error) => {
      this.AlertRegister('All fields are required!');
      loading.dismiss();
    });
  }

  dismissRegister() {
    this.modalController.dismiss();
  }

  backPage(){
    this.router.navigateByUrl('/login');
  }

  async AlertRegister(Message) {
    const alert = await this.alertController.create({
      header: 'Warning!',
      //subHeader: 'Subtitle',
      message: Message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async AlertSuccess(message) {
    const alert = await this.alertController.create({
      message: message,
      buttons: [{
        text: 'OK',
        handler: () =>{
            this.backPage();
        }
      }],
    });
    await alert.present();
    let result = await alert.onDidDismiss();
    console.log(result);
}

}
