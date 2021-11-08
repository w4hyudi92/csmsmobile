import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad';
import { DetailwoPage } from '../detailwo/detailwo';
import { ApiProvider } from '../../providers/api/api';
/**
 * Generated class for the SignaturePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-signature',
  templateUrl: 'signature.html',
  providers: [ApiProvider]
})
export class SignaturePage {

  @ViewChild(SignaturePad) public signaturePad : SignaturePad;

  public signaturePadOptions : Object = {
    'minWidth': 2,
    'canvasWidth': 340,
    'canvasHeight': 200
  };
  public signatureImage : string;
  ron: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public api: ApiProvider,) {
    this.ron = navParams.get("ron");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignaturePage');
  }

  drawCancel() {
    this.navCtrl.pop();
  }

   drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    this.navParams.get('signatureImage').signatureImage = this.signatureImage;
    this.navCtrl.pop();
    this.api.pushImage(this.ron + '-sign.jpg', this.signatureImage, 'signature');
    //this.navCtrl.push(DetailwoPage, {signatureImage: this.signatureImage});
  }

  drawClear() {
    this.signaturePad.clear();
  }

  canvasResize() {
    let canvas = document.querySelector('canvas');
    this.signaturePad.set('minWidth', 1);
    this.signaturePad.set('canvasWidth', canvas.offsetWidth);
    this.signaturePad.set('canvasHeight', canvas.offsetHeight);
  }

  ngAfterViewInit() {
    this.signaturePad.clear();
    this.canvasResize();
  }

}
