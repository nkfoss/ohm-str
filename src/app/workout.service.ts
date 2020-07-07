import { Injectable } from '@angular/core';
import { Exercise } from './shared/exercise.model';
import { Workout } from './shared/workout.model'
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StringHandlerService } from './string-handler.service';
import { RepmaxService } from './repmax.service';
import { AuthService } from './auth/auth.service';
import { take, exhaustMap, tap } from 'rxjs/operators';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})

// ============================================

export class WorkoutService {

  constructor(private http: HttpClient,
    private repmaxService: RepmaxService,
    private authService: AuthService) { }

  exerciseUpdated = new BehaviorSubject<Exercise[]>(null);
  workout: Workout = {
    date: "",
    category: "",
    notes: "",
    exercises: []
  }


  //========================================================

  getWorkout() { return this.workout; }

  getFormattedDate() { return this.workout.date }

  getExercises() { return this.workout.exercises.slice(); }

  getExercise(exerciseIndex: number): Exercise { return { ...this.workout.exercises[exerciseIndex] }; }

  addExercise(newExercise: Exercise) {
    this.workout.exercises.push(newExercise);
    console.log(this.getExercises())
    this.exerciseUpdated.next(this.getExercises())
  }

  updateExercise(exerciseIndex: number, newExercise: Exercise) {
    this.workout.exercises[exerciseIndex] = newExercise;
    this.exerciseUpdated.next(this.getExercises())
  }

  deleteSet(exerciseIndex: number, setIndex: number) {
    this.workout.exercises[exerciseIndex].sets.splice(setIndex, 1)
    this.exerciseUpdated.next(this.getExercises())
  }

  deleteExercise(exerciseIndex: number) {
    this.workout.exercises.splice(exerciseIndex, 1);
    this.exerciseUpdated.next(this.getExercises())
  }


  // ==========================================================================================


  storeWorkout() {
    this.convertToLowerCase(this.workout.exercises)
    const url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + this.workout.date + '.json'
    this.http.patch(url, this.workout).subscribe(response => { console.log(response) })
  }

  convertToLowerCase(exercises: Exercise[]) {
    exercises.forEach(exercise => {
      exercise.exerciseName = exercise.exerciseName.toLowerCase()
    })
  }

  fetchWorkout(dateString?: string) {

    let url: string;
    let fetchedWorkout: Workout;

    if (dateString) {
      this.workout.date = dateString
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + dateString + '.json'
    } else {
      const date = new Date().toLocaleString()
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + date + '.json'
    }

    return this.http.get(url).pipe(
      tap((workout: Workout) => {
        if (workout) {
          this.workout = workout;
          this.exerciseUpdated.next(this.workout.exercises)
        }
      })
    )
    // Exhaust map allows to combine the user and http observables into one.
    // Exhaust map waits for the previous observable to complete (in this case, the observable that is
    // returned from 'take'), and then replaces it with the observable created by the lambda function
    // within exhaustmap.

    // this.http.get(url).subscribe((workout: Workout) => {
    //   // Check to see if there was an entry for this. 
    //   // If not, create a new workout object with the specified date.
    //   if (workout) {
    //     this.workout = workout;
    //     this.exerciseUpdated.next(this.workout.exercises)
    //   }
    // })
  }

  patchMaxes() {
    this.repmaxService.storeAllMaxes(this.workout)
  }

}

 // private workout: Workout = {
  //   date: new Date(),
  //   category: "category placeholder",
  //   notes: "notes placeholder......",
  //   exercises: [
  //     { exerciseName: "Bench Press",
  //       sets: [
  //         { weight: 45, reps: 12 },
  //         { weight: 95, reps: 10 },
  //         { weight: 135, reps: 5 },
  //         { weight: 155, reps: 7 } 
  //       ] 
  //     },
  //       { exerciseName: "Side Lateral Raise",
  //       sets: [
  //         { weight: 15, reps: 10 },
  //         { weight: 15, reps: 10 },
  //         { weight: 17.5, reps: 8 }
  //       ]
  //     },
  //     { exerciseName: "Tricep Pressdown",
  //       sets: [
  //         { weight: 42.5, reps: 10 },
  //         { weight: 50, reps: 10 },
  //         { weight: 60, reps: 10 },
  //         { weight: 60, reps: 1 }
  //       ]
  //     },
  //     { exerciseName: "Leg Press",
  //       sets: [
  //         { weight: 180, reps: 8 },
  //         { weight: 215, reps: 11 },
  //         { weight: 240, reps: 8 },
  //         { weight: 270, reps: 10 },
  //         { weight: 270, reps: 3 },
  //         { weight: 270, reps: 3 },
  //         { weight: 270, reps: 3 },
  //       ]
  //     },
  //     { exerciseName: "Cable Crunches",
  //       sets: [
  //         { weight: 90, reps: 10 },
  //         { weight: 110, reps: 9 },
  //         { weight: 100, reps: 2 },
  //       ]
  //     },
  //   ]
  // }
