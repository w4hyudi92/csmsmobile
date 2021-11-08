import { Component } from '@angular/core';

/**
 * Generated class for the TabsComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'tabs',
  templateUrl: 'tabs.html'
})
export class TabsComponent {

  text: string;

  constructor() {
    console.log('Hello TabsComponent Component');
    this.text = 'Hello World';
  }

}
