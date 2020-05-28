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
			cpuSubtext: "(All Core OC) 5.0 GHz @ 1.34v",
			cpuSubtext2: "x44 Cache Overclock",
			ram: "GSkill Trident Z RGB 32GB",
			ramSubtext: "(4 × 8GB) CL16 3000MHz DDR4",
			ramSubtext2: "(OC) 3200MHz 16-18-38 1.38v",
			gpu: "Asus ROG Strix GTX 1070 OC",
			gpuSubtext: "(8GB DDR5) +30 Core, +1K Mem",

			motherboard: "Asus ROG Strix Z390-E",
			psu: "CoolerMaster MasterWatt 650W",
			psuSubtext: "80+ Bronze",
			cooler: "Noctua NH-U12S chromax",
			coolerSubtext: "2x Noctua NF-F12 chromax",
			ssd: "Samsung 860 EVO 1TB",
			hdd: "Western Digital Black 2TB",

			case: "NZXT H700 Matte Black",
			fans: "3x Noctua NF-S12A chromax",
			fansSubtext: "3x Thermaltake Riing Plus 120",
			fansSubtext2: "Thermaltake Fan Controller",

			monitor: "Dell SE2717H (1920 × 1080) 75Hz",
			speakers: "Bose Companion 50 2.1",

			keyboard: "Razer Blackwidow TE Chroma",
			mouse: "Razer Deathadder Chroma",
			mat: "Steelseries QCK XXL",
			matSubtext: "(900 × 400mm)",
		};
	}
}
