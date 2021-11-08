import { Component } from '@angular/core';
import { ToastController, LoadingController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
/**
 * Generated class for the ChangepassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-changepass',
  templateUrl: 'changepass.html',
})
export class ChangepassPage {
  passwordType0: string = 'password';
  passwordIcon0: string = 'eye-off';
  passwordType1: string = 'password';
  passwordIcon1: string = 'eye-off';
  passwordType2: string = 'password';
  passwordIcon2: string = 'eye-off';
  confirmPassword:string;
  newPassword:string;
  oldPassword:string;
  slideOneForm: FormGroup;
  submitAttempt: boolean = false;
  public param:any;
  public arr_token: any;
  arrList=[];

  constructor(public navCtrl: NavController, public navParams: NavParams, 
    public formBuilder: FormBuilder,
    public api: ApiProvider,
    public toastCtrl: ToastController,
    private storage: Storage,
    public loadingCtrl: LoadingController
    ) {
    this.slideOneForm = formBuilder.group({
      password0: ['',Validators.compose([Validators.required])],
      password1: ['',Validators.compose([Validators.minLength(8), Validators.maxLength(12), Validators.pattern('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,12}$'), Validators.required])],
      password2: ['', Validators.compose([Validators.required])]
    },{
      validator: this.matchingPasswords()
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangepassPage');
  }

  matchingPasswords() {
    return (group: FormGroup): {[key: string]: any} => {
      let password = group.controls['password1'];
      let confirmPassword = group.controls['password2'];

      if (password.value !== confirmPassword.value) {
        return {
          mismatchedPasswords: true
        };
      }
    }
  }

  showHide(num){
    switch (num) {
      case 0:
        this.passwordType0 = this.passwordType0 === 'text' ? 'password' : 'text';
        this.passwordIcon0 = this.passwordIcon0 === 'eye-off' ? 'eye' : 'eye-off';
        break;
      case 1:
        this.passwordType1 = this.passwordType1 === 'text' ? 'password' : 'text';
        this.passwordIcon1 = this.passwordIcon1 === 'eye-off' ? 'eye' : 'eye-off';
        break;
      case 2:
        this.passwordType2 = this.passwordType2 === 'text' ? 'password' : 'text';
        this.passwordIcon2 = this.passwordIcon2 === 'eye-off' ? 'eye' : 'eye-off';
        break;
      default:
        break;
    }
    
  }
  save(){
    this.submitAttempt = true;
 
    if(this.slideOneForm.valid){
      const loader = this.loadingCtrl.create({
        content: "Mohon Tunggu, Sedang menunggu respon server...",
      });
      loader.present();

      this.storage.get('prof').then(profile => {
        this.arr_token = this.api.random();
        this.param = {
            params: {
            mod: 'notifikasi',
            act: 'update_pass',
            id: profile.nik,
            password_old: this.oldPassword,
            password_new: this.newPassword,
            rand: this.arr_token.rand,
            sessid: this.arr_token.sessid,
            token: this.arr_token.token
            }
        };

        this.api.getApi(this.param).then(data => 
        {
          if(data['STATUS'] =="SUKSES") {
            this.submitAttempt = false;
            const toast = this.toastCtrl.create({
              message: 'Ganti password berhasil..',
              duration: 3000,
              position: 'top'
            });
            toast.present(toast);
            this.oldPassword = "";
            this.newPassword = "";
            this.confirmPassword = "";
           // this.navCtrl.pop();
            loader.dismiss();
          }else{
   
            const toast = this.toastCtrl.create({
              message: data['MESSAGE'],
              duration: 3000,
              position: 'top'
            });
            toast.present(toast);
            loader.dismiss();
          }
        });
      
    });
   
    }
  }
}
