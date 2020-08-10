import { Component, OnInit} from '@angular/core';
import { WorkoutService } from './workout.service';
import { Exercise } from './shared/exercise.model';
import { Subscription } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { RepmaxService } from './repmax.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

//========================================

export class AppComponent implements OnInit{

  private exercises: Exercise[];
  exerciseSub: Subscription

  //========================================

  constructor(private workoutService: WorkoutService,
      private authService: AuthService,
      private repMaxService: RepmaxService) {}

  ngOnInit() {
    this.authService.autoLogin()
    this.repMaxService.fetchRecords()
    }

  }

