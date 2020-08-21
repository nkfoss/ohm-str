import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringHandlerService } from '../string-handler.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { WorkoutService } from '../workout.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

// ==================================================

export class HomeComponent {

  selectedDate: Date;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private stringHandlerService: StringHandlerService,
    private workoutService: WorkoutService) { }


  // =============================================================

  getTodaysWorkout() {
    const today = this.stringHandlerService.stripWeekday( 
      new Date().toDateString()
    )
    const toNavigate = 'workout/' + today;
    this.router.navigate([toNavigate])
  }

  setSelectedDate(event: MatDatepickerInputEvent<Date>) {
    this.selectedDate = event.value;
    console.log(event.value)
  }

  navigateToDate() {
    const formattedDate = this.stringHandlerService.stripWeekday(
      this.selectedDate.toDateString()
    )
    const toNavigate = 'workout/' + formattedDate;
    this.router.navigate([toNavigate]);
    if (this.workoutService.workout.date !== formattedDate) {
			this.workoutService.fetchWorkout(formattedDate);
		}
  }

}
