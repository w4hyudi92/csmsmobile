import { HttpClient } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
//import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import 'rxjs/add/operator/filter';
import { Observable } from 'rxjs';


@Injectable()
export class LocationTracker {

  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;

  // config: BackgroundGeolocationConfig = {
  //   desiredAccuracy: 0,
  //   stationaryRadius: 20,
  //   distanceFilter: 10, 
  //   debug: true,
  //   interval: 2000 
  // };



  constructor(public zone: NgZone,
    //private backgroundGeolocation: BackgroundGeolocation,
    private geolocation: Geolocation,
    ) {
      
      
  }

  // showNotification(data){
  //   // Schedule a single notification
  //   this.localNotifications.schedule({
  //     id: 1,
  //     text: JSON.stringify(data),
  //     sound: 'file://sound.mp3',
  //     data: { secret: "key" }
  //   });
  // }

  startTracking() {
    // this.backgroundGeolocation.configure(this.config).subscribe((location: BackgroundGeolocationResponse) => {
  
    //   this.zone.run(() => {
    //     this.lat = location.latitude;
    //     this.lng = location.longitude;
    //   });

    // });

    // this.backgroundGeolocation.start();

    // let options = {
    //   frequency: 3000, 
    //   enableHighAccuracy: true
    // };
  
    // this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
  
    //   console.log(position);
  
    //   // Run update inside of Angular's zone
    //   this.zone.run(() => {
    //     this.lat = position.coords.latitude;
    //     this.lng = position.coords.longitude;
    //   });
  
    // });
  }

  stopTracking() {


  }

}