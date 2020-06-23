import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataStorageService } from "../data-storage.service";

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

// =====================================================


export class NavbarComponent {

	isNavbarCollapsed = true;
	logStatus = true;
	logStatusChanged = false;

	// =====================================================

	constructor(private activatedRoute: ActivatedRoute,
				private dataStorageService: DataStorageService) {}

	// =====================================================

	toggleLogStatus() {
		this.logStatus = !this.logStatus;
		this.logStatusChanged = true;
	}

	onSaveData() {
		this.dataStorageService.storeWorkout();
	}

	onFetchData(){
		this.dataStorageService.fetchWorkout();
	}


}