import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController, ActionSheetController, Platform, LoadingController   } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase , AngularFireList  } from 'angularfire2/database';
import * as moment from 'moment';
import * as firebase from 'firebase/app';
import { firebaseConfig,snapshootToArray } from '../../app/app.config.firebase';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Device } from '@ionic-native/device';
import { Storage } from '@ionic/storage';

declare var google: any;

@IonicPage()
@Component({
  selector: 'page-firebase',
  templateUrl: 'firebase.html',
})
export class FirebasePage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  markers = [];

  songs: any;
  todo: any = [];
  items = [];
  ref_items= firebase.database().ref('items/');
  inputText: string='';
  nik: string;
  latitude: string;
  longitude:string;
  params: any;
  distance:string;
  est:string;
  end_address:string;
  hide :boolean;
  mylocation: any;

  start: any; end: any;
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer({preserveViewport: true}); 

  autocomplete = new google.maps.places.AutocompleteService();
  currentPositionMarker: any; 
  mapCenter = new google.maps.LatLng(-6.2251257, 106.8292454);

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    private angDatabase: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public geolocation: Geolocation,
    public loadingCtrl: LoadingController,
    private device: Device,
    private storage: Storage,
    public alertCtrl: AlertController) {
      this.start = "jakarta";
      this.end = "kerawang";   
      this.params = navParams.get("alamat");
      this.hide= false;
      this.est = "0 Menit";
      this.distance = "0 Km";
      // this.ref.on('value', resp => {
      //   this.deleteMarkers();
      //   snapshtToArray(resp).forEach(data => {
      //     if(data.uuid !== this.device.uuid) {
      //       let image = 'assets/imgs/green-bike.png';
      //       let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
      //       this.addMarker(updatelocation,image);
      //       this.setMapOnAll(this.map);
      //     } else {
      //       let image = 'assets/imgs/blue-bike.png';
      //       let updatelocation = new google.maps.LatLng(data.latitude,data.longitude);
      //       this.addMarker(updatelocation,image);
      //       this.setMapOnAll(this.map);
      //     }
      //   });
      // });
      // platform.ready().then(() => {
      //   this.storage.get('prof').then(profile => {
      //     this.nik= profile.nik;
      //     this.initMap();
      //   });
      // });
  }

  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 15,
      center: this.mapCenter,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    const loader = this.loadingCtrl.create({
      content: "Mohon Tunggu, Sedang menunggu respon server...",
    });
    //loader.present();

    let watch = this.geolocation.watchPosition();
    watch.subscribe((data) => {

      this.mylocation = new google.maps.LatLng(data.coords.latitude,data.coords.longitude);
      // this.map = new google.maps.Map(this.mapElement.nativeElement, {
      //   zoom: 15,
      //   center: mylocation,
      //   mapTypeId:google.maps.MapTypeId.ROADMAP,
      //   mapTypeControl:false,
      //   navigationControlOptions:{style:google.maps.NavigationControlStyle.SMALL}
      // });

      //this.map.setCenter(this.mylocation);
      //this.map.panTo(this.mylocation);

      this.directionsDisplay.setMap(this.map);

      //this.distance= google.maps.geometry.spherical.computeDistanceBetween(mylocation,loc2);

      this.directionsService.route({
        origin: this.mylocation,
        destination: this.params,
        travelMode: 'DRIVING'
      }, (response, status) => {
        if (status === 'OK') {

          let position = {
            target: this.mylocation,
            zoom: 17
          };
          //this.map.animateCamera(position);

          this.directionsDisplay.setDirections(response);
          this.distance = response.routes[0].legs[0].distance.text;
          this.est = response.routes[0].legs[0].duration.text;
          this.end_address = response.routes[0].legs[0].end_address;  


        } else {
          window.alert('Directions request failed due to ' + status);
        }
         //loader.dismiss();
       });
    });
    
  }

  pusatkan(){
    this.map.setCenter(this.mylocation);
    this.map.panTo(this.mylocation);
    this.map.setZoom(18);
  }

  setMarkerPosition(marker, position) {
    marker.setPosition(
        new google.maps.LatLng(
            position.coords.latitude,
            position.coords.longitude)
    );
  }

  setLocation() {

    let latLng = new google.maps.LatLng(53.550513, 9.994241);
    let mapOptions = {
      center: latLng,
      zoom: 15,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
  
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);    
    this.markers = new google.maps.Marker({
      position: latLng,
      map: this.map,
     });
  }

  ionViewDidLoad() {
    this.initMap();
  }

  addItem(item){
    if(item !== undefined && item !== null){
      let newItem = this.ref_items.push();
      newItem.set(item);
      this.inputText = '';
    }
  }
  async delItem(key){
    firebase.database().ref('items/'+key).remove();
  }
  editItem(key){
    let prompt = this.alertCtrl.create({
      title: 'Edit Item',
      //message: "Tambahkan daftar pekerjaan yang ingin anda lakukan",
      inputs: [
        {
          name: 'name',
          placeholder: 'Name',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Edit',
          handler: data => {
            if(data.name !== undefined && data.name.length >0){
              firebase.database().ref('items/'+key).update({name: data.name});
            }
          }
        }
      ]
    });
    prompt.present();
  }
  addMarker(location, image) {
    let marker = new google.maps.Marker({
      position: location,
      map: this.map,
      icon: image
    });
    this.markers.push(marker);
  }
  
  setMapOnAll(map) {
    for (var i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(map);
    }
  }
  
  clearMarkers() {
    this.setMapOnAll(null);
  }
  
  deleteMarkers() {
    this.clearMarkers();
    this.markers = [];
  }

  hideinfo(num){
    this.hide =  num;
  }

}

export const snapshtToArray = snapshot => {
  let returnArr = [];

  snapshot.forEach(childSnapshot => {
      let item = childSnapshot.val();
      item.key = childSnapshot.key;
      returnArr.push(item);
  });

  return returnArr;
};
