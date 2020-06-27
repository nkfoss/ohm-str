import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

// ==================================================

export class HomeComponent {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router) { }


  // =============================================================

  getTodaysWorkout() {
    const today = new Date().toDateString();
    const toNavigate = 'workout/' + today;
    this.router.navigate([toNavigate])
  }

}
