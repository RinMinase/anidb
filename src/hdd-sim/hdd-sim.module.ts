import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from "@angular/router";

import { HddSimComponent } from './hdd-sim.component';

const routes: Routes = [
	{
		path: "",
		component: HddSimComponent,
		children: [
			{
				path: "",
				component: HddSimComponent,
			},
		],
	},
];

@NgModule({
	declarations: [
		HddSimComponent
	],
	imports: [
		CommonModule,
		RouterModule.forChild(routes),
	]
})
export class HddSimModule {}
