import { Component, OnInit } from "@angular/core";

@Component({
	selector: "app-unit-specs",
	templateUrl: "./unit-specs.component.html",
	styleUrls: ["./unit-specs.component.scss"],
})
export class UnitSpecsComponent implements OnInit {
	data: any;

	constructor() {}

	ngOnInit() {
		this.data = {
			cpu: "Intel Core i7-9700K",
			cpuSubtext: "(All Core OC) 5.00 GHz @ 1.36v",
			ram: "GSkill Trident Z RGB 32GB",
			ramSubtext: "(4 × 8GB) CL16 3000MHz DDR4",
			gpu: "Asus ROG Strix GTX 1070 OC",
			gpuSubtext: "(8GB DDR5)",

			motherboard: "Asus ROG Strix Z390-E Gaming",
			psu: "CoolerMaster MasterWatt 650W",
			psuSubtext: "80+ Bronze",
			cooler: "Noctua NH-U12S chromax",
			coolerSubtext: "2x Noctua NF-F12 chromax",
			ssd: "Samsung 860 EVO 1TB",
			hdd: "Western Digital Black 2TB",

			case: "NZXT H700 Matte Black",
			fans: "3x Thermaltake Riing Plus 120",
			fansSubtext: "Thermaltake Riing Fan Controller",
			fansSubtext2: "3x Noctua NF-S12A chromax 120mm",

			monitor: "Dell SE2717H (1920 × 1080)",
			speakers: "Bose Companion 50 2.1",

			keyboard: "Razer Blackwidow TE Chroma",
			mouse: "Razer Deathadder Chroma",
			mat: "Steelseries QCK XXL",
			matSubtext: "(900 × 400mm)",
		};
	}
}
