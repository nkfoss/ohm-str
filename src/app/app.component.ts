import { Component, OnInit} from '@angular/core';
import { WorkoutService } from './workout.service';
import { Exercise } from './shared/exercise.model';
import { Subscription } from 'rxjs';

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

  constructor(private workoutService: WorkoutService) {}

  ngOnInit() {
    this.exercises = this.workoutService.getExercises();
    this.exerciseSub = this.workoutService.exerciseUpdated.subscribe(
        (updatedSets: Exercise[]) => {
          this.exercises = updatedSets;
        }
      )
    }

  }

