import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { WorkoutService } from "../workout.service";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";
import { RepmaxService } from "../repmax.service";

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})

// =====================================================


export class NavbarComponent implements OnInit, OnDestroy {

	isAuthenticated = false; // Authenticated users see different things.
	private userSub: Subscription; // also used for authentication.

	isNavbarCollapsed = true; 

	// =====================================================

	constructor(private workoutService: WorkoutService,
		private router: Router,
		private authService: AuthService) { }

	ngOnInit() {
		this.userSub = this.authService.userSubject.subscribe(
			user => {
				this.isAuthenticated = !!user
				// This makes it so if we get a null user, we will assign 'false'
			})
	}

	ngOnDestroy() { this.userSub.unsubscribe() }

	// =====================================================

	onLogout() {
		this.authService.logout()
	}

	onNavigateHome() {
		this.router.navigate(['home'])
	}

	onFetchData() {
		const date = new Date().toDateString();
		this.workoutService.fetchWorkout(date);
	}

	onNavigateToToday() {
		const today = this.stripWeekday(
			new Date().toDateString()
		)
		const toNavigate = 'workout/' + today;

		this.router.navigate([toNavigate]);
		if (this.workoutService.workout.date !== today) {
			this.workoutService.fetchWorkout(today);
		}
	}

	stripWeekday(dateString: string) {
		const regex = /^.{4}/gi
		return dateString.replace(regex, '')
	}

}


