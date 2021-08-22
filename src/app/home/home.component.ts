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
  constructor( private router: Router ) {}

  // =============================================================

  setSelectedDate(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
  }

  navigateToDate() {
    this.router.navigate(
      ["workouts"],
      { queryParams: {
        year: this.selectedDate.getFullYear(),
        month: this.selectedDate.getMonth() + 1,
        date: this.selectedDate.getDate()
      }});
  }

}
