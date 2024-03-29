import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

// ==================================================

export class HomeComponent {

  selectedDate: Date;
  constructor( private router: Router ) {}

  // =============================================================

  setSelectedDate(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }

  navigateToDate() {
    this.router.navigate(
		["workouts"],
		{ queryParams: {
			dateString: this.selectedDate.toLocaleDateString()
		}});
  }

}
