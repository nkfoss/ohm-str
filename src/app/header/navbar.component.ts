import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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

	constructor(private activatedRoute: ActivatedRoute,
				private workoutService: WorkoutService) {}

	// =====================================================

	toggleLogStatus() {
		this.logStatus = !this.logStatus;
		this.logStatusChanged = true;
	}

	onSaveData() {
		this.workoutService.storeWorkout();
	}

	onFetchData(){
		const date = new Date().toDateString();
		this.workoutService.fetchWorkout(date);
	}


}