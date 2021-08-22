import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import * as moment from 'moment'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
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

  /**
   * Used for navigation
   */
  formatDatePipe = new DatePipe('en-US');

  // =====================================================

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.userSub = this.authService.userSubject.subscribe(
      user => {
        this.isAuthenticated = !!user;
        // This makes it so if we get a null user, we will assign 'false'
      });
  }

	ngOnDestroy() {this.userSub.unsubscribe() }

  // =====================================================

	onLogout() {
		this.authService.logout()
	}

	onNavigateHome() {
		this.router.navigate(['home']);
		this.isNavbarCollapsed = !this.isNavbarCollapsed;
	}

	onNavigateToToday() {
		const today = new Date();
		this.router.navigate( 
			["workouts"], 
			{ queryParams: {
				year: today.getFullYear(),
				month: today.getMonth() + 1,
				date: today.getDate()
			}});
		this.isNavbarCollapsed = !this.isNavbarCollapsed;
	}
}


