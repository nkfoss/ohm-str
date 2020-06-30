import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { WorkoutService } from "../workout.service";

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

	constructor(private workoutService: WorkoutService,
				private router: Router) {}

	// =====================================================

	toggleLogStatus() {
		this.logStatus = !this.logStatus;
		this.logStatusChanged = true;
	}

	onNavigateHome() {
		this.router.navigate(['home'])
	}

	onSaveData() {
		this.workoutService.storeWorkout();
	}

	onFetchData(){
		const date = new Date().toDateString();
		this.workoutService.fetchWorkout(date);
	}

	onPatchMaxes() {
		this.workoutService.patchMaxes()
	}


}