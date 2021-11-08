import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
//import { Facebook } from '@ionic-native/facebook';

@Injectable()
export class LoginProvider {

  constructor(public http: HttpClient) {
    console.log('Hello LoginProvider Provider');
    //firebase.initializeApp({apiKey: 'AIzaSyADoLFwtJJDP18gdvby2hDWNLy5VM95gtE',});
  }

  // googlePlusLogin(): Promise<any> {
  //   // return this.googlePlus.login({})
  //   // .then( response => {
  //   //   //alert("Sukses : " + JSON.stringify(response));
  //   //   firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
  //   //   const googleCredential = firebase.auth.GoogleAuthProvider.credential(null, response.accessToken);
  //   //   firebase.auth().signInWithCredential(googleCredential)
  //   //     .then( success => {
  //   //       //alert("Firebase success: " + JSON.stringify(success));
  //   //     }).catch((err) => {
  //   //       alert(err);
  //   //     });
  //   // }).catch((error) => { alert("Error : "+ error) });
  // }

  logout(){
    //this.googlePlus.logout();
    //this.facebook.logout();
    firebase.auth().signOut().then(function() {
      alert("logout successful");
      
    }, function(error) {
      console.log(error);
    });
  }

  // facebookLogin(): Promise<any> {
  //   return this.facebook.login(['public_profile', 'email']).then( response => {
  //     const facebookCredential = firebase.auth.FacebookAuthProvider
  //       .credential(response.authResponse.accessToken);
  //       //alert(JSON.stringify(facebookCredential));
  //       firebase.auth().signInWithCredential(facebookCredential)
  //       .then( success => { 
  //         alert("Firebase success: " + JSON.stringify(success)); 
  //       }).catch((err) => {
  //         alert(err);
  //       });

  //   }).catch((error) => { alert(JSON.stringify(error)) });
  // }

}
