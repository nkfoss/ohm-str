import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StringHandlerService } from '../string-handler.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

// ==================================================

export class HomeComponent {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private stringHandlerService: StringHandlerService) { }


  // =============================================================

  getTodaysWorkout() {
    const today = this.stringHandlerService.stripWeekday( 
      new Date().toDateString()
    )
    const toNavigate = 'workout/' + today;
    this.router.navigate([toNavigate])
  }

}
