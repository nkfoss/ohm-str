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

	/**
	 * The user's authentication status. Unauthenticated users can only interact with the login page.
	 * Automatically updated by the userSub.
	 */
	isAuthenticated = false; 

	/**
	 * Used to update isAuthenticated. 
	 * If no User object is received, then the current user is unauthenticated.
	 */
	private userSub: Subscription; // also used for authentication.

	/**
	* Used to open the navbar element. Toggled when the user clicks on the navbar.
	*/
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

	/**
	 * Button function. Tells the AuthService to logout.
	 */
	onLogout() {
		this.authService.logout()
	}

	/**
	 * Button function. Navigates to the home page.
	 */
	onNavigateHome() {
		this.router.navigate(['home']);
		this.isNavbarCollapsed = !this.isNavbarCollapsed;
	}


	// onFetchData() {
	// 	const date = new Date().toDateString();
	// 	this.workoutService.fetchWorkout(date);
	// }

	/**
	 * Button function. Navigates to the current date.
	 */
	onNavigateToToday() {
		const today = this.stripWeekday( new Date().toDateString() )
		const toNavigate = 'workout/' + today;

		this.router.navigate([toNavigate]);
		this.isNavbarCollapsed = !this.isNavbarCollapsed;
		// if (this.workoutService.workout.date !== today) {
		// 	this.workoutService.fetchWorkout(today);
		// }
	}

	/**
	 * Remove the weekday from a Date object that was converted to a string.
	 * @param dateString - A date object converted to a string.
	 * @returns A correctly formatted date-string to be used in navigation.
	 */
	private stripWeekday(dateString: string): string {
		const regex = /^.{4}/gi
		return dateString.replace(regex, '')
	}

}


