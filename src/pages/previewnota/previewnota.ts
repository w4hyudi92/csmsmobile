import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
//import { PdfViewerModule } from 'ng2-pdf-viewer';
/**
 * Generated class for the PreviewnotaPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-previewnota',
  templateUrl: 'previewnota.html',
})
export class PreviewnotaPage {

  pdfSrc:any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pdfSrc = navParams.get("param");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PreviewnotaPage');
  }

}
