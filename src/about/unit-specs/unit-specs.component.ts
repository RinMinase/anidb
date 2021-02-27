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
			ramSubtext: "(4 × 8GB) CL16 3000MHz",
			gpu: "Asus ROG Strix GTX 1070 OC",
			gpuSubtext: "(8GB DDR5) +50 Core, +490 Mem",

			motherboard: "Asus ROG Strix Z390-E",
			psu: "CoolerMaster MWE Bronze 650W",
			cooler: "Noctua NH-U12S chromax",
			coolerSubtext: "2x Noctua NF-F12 chromax",
			ssd: "Gigabyte AORUS Gen4 NVME 2TB",
			ssdSubtext: "Samsung 860 EVO 1TB",
			hdd: "Seagate Ironwolf 8TB",

			case: "NZXT H700 Matte Black",
			fans: "3x Noctua NF-S12A chromax",
			fansSubtext: "3x Noctua NF-F12 chromax",
			fansSubtext2: "3x Noctua NF-A14 chromax",
			fansSubtext3: "2x Deepcool FH-04 Fan Splitter",

			monitor: 'Dell SE2717H 27" 1080p 75Hz',
			speakers: "Bose Companion 50 2.1",

			keyboard: "Logitech G913 Wireless",
			mouse: "Logitech G Pro Wireless",
			headset: "Corsair Virtuoso Wireless SE",
			mat: "SteelSeries QCK XXL",
			matSubtext: "(900 × 400mm)",
		};
	}
}
