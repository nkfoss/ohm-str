import { Injectable } from '@angular/core';
import { Exercise } from './shared/exercise.model';
import { Workout } from './shared/workout.model'
import { Subject, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

// ============================================

export class WorkoutService {

  constructor(private http: HttpClient) { }

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
    const url = 'https://strengthpractice-7e443.firebaseio.com/' + this.workout.date + '.json'
    this.http.put(url, this.workout).subscribe(response => { console.log(response) })
  }

  fetchWorkout(dateString?: string) {

    let url: string;
    let fetchedWorkout: Workout;

    if (dateString) {
      this.workout.date = dateString
      url = 'https://strengthpractice-7e443.firebaseio.com/' + dateString + '.json'
    } else {
      const date = new Date().toDateString()
      url = 'https://strengthpractice-7e443.firebaseio.com/' + date + '.json'
    }

    this.http.get(url).subscribe((workout: Workout) => {
      // Check to see if there was an entry for this. 
      // If not, create a new workout object with the specified date.
      if (workout) {
        this.workout = workout;
        this.exerciseUpdated.next(this.workout.exercises)
      } 
    })
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
