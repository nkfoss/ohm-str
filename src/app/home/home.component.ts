import { Component } from '@angular/core';
import { DatePipe } from '@angular/common';
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
  formatDatePipe = new DatePipe('en-US');
  formattedDate: String;

  constructor( private router: Router ) {}

  // =============================================================

  getTodaysWorkout() {
    const today = this.formatDatePipe.transform(new Date().toDateString(), 'LLL d y');
    const toNavigate = 'workout/' + today;
    this.router.navigate([toNavigate]);
  }

  setSelectedDate(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    this.formattedDate = this.formatDatePipe.transform(this.selectedDate, 'LLL d y');
    console.log(event.value);
  }

  navigateToDate() {
    const toNavigate = 'workout/' + this.formattedDate;
    this.router.navigate([toNavigate]);
  }

}
