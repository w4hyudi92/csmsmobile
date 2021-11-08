import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from 'ionic-angular';
import { LayoutLoginComponent } from './layout-login/layout-login';
import { TabsComponent } from './tabs/tabs';
import { AccordionListComponent } from './accordion-list/accordion-list';

export const components = [
	AccordionListComponent
  ];

@NgModule({
	declarations: [
    	LayoutLoginComponent,
		TabsComponent,
		AccordionListComponent
	],
	imports: [
		CommonModule,
		IonicModule
	],
	exports: [
		LayoutLoginComponent,
		TabsComponent,
		AccordionListComponent
	]
})
export class ComponentsModule {}
