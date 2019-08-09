import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-unit-specs",
	templateUrl: "./unit-specs.component.html",
	styleUrls: ["./unit-specs.component.scss"],
})
export class UnitSpecsComponent implements OnInit {

	data: any;

	constructor() { }

	ngOnInit() {
		this.data = {
			cpu: "Intel Core i7-9700K (12M, 4.9GHz)",
			ram: "GSkill Trident Z RGB 16GB",
			ramSubtext: "(2 × 8GB) 3000MHz DDR4",
			gpu: "Asus ROG Strix GTX 1070 OC",
			gpuSubtext: "(8GB DDR5)",

			motherboard: "Asus ROG Strix Z390-E Gaming",
			psu: "CoolerMaster MasterWatt 650W",
			psuSubtext: "80+ Bronze",
			cooler: "FSP Windale 4 120mm HSF",
			ssd: "Samsung 860 EVO 250GB",
			hdd: "Western Digital Black 2TB",

			case: "Tecware Edge (Mid-Tower)",
			fans: "Thermaltake Riing Premium 120",

			monitor: "Samsung S20D300 (1600 × 900)",
			speakers: "Bose Companion 50 2.1",

			keyboard: "Razer Blackwidow TE Chroma",
			mouse: "Razer Deathadder Chroma",
			mat: "Steelseries QCK XXL",
			matSubtext: "(900 × 400mm)",
		};
	}

}
