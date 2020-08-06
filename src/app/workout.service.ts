import { Injectable, OnInit } from '@angular/core';
import { Exercise } from './shared/exercise.model';
import { Workout } from './shared/workout.model'
import { BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { RepmaxService } from './repmax.service';

@Injectable({
  providedIn: 'root'
})

// ============================================

export class WorkoutService {

  exerciseUpdated = new BehaviorSubject<Exercise[]>(null);
  workout: Workout = {
    date: "",
    category: "",
    notes: "",
    exercises: []
  }

  // =============================================================

  constructor(private http: HttpClient,
    private repMaxService: RepmaxService) { }

  //========================================================

  getWorkout() { return this.workout; }

  getFormattedDate() { return this.workout.date }

  getExercises() { return this.workout.exercises.slice(); }

  getExercise(exerciseIndex: number): Exercise { return { ...this.workout.exercises[exerciseIndex] }; }

  addExercise(newExercise: Exercise) {
    newExercise.exerciseName = newExercise.exerciseName.toLowerCase();
    // Check to see if a repmax record exists...
    // If not, then calculate it from the sets, and set the record
    let recordMax = this.repMaxService.getRecordMaxFromName(newExercise.exerciseName)
    if (!recordMax) {
      recordMax = this.repMaxService.calculateBestMax(newExercise);
      this.repMaxService.recordMaxes[newExercise.exerciseName] = recordMax;
    }
    this.repMaxService.setPercentEffort(newExercise, recordMax)
    this.workout.exercises.push(newExercise);
    this.exerciseUpdated.next(this.getExercises())
  }

  updateExercise(exerciseIndex: number, updatedExercise: Exercise) {
    updatedExercise.exerciseName = updatedExercise.exerciseName.toLowerCase();
    // Check to see if a repmax record exists...
    // If not, then calculate it from the sets
    let recordMax = this.repMaxService.getRecordMaxFromName(updatedExercise.exerciseName)
    if (!recordMax) {
      recordMax = this.repMaxService.calculateBestMax(updatedExercise);
      this.repMaxService.recordMaxes[updatedExercise.exerciseName] = recordMax;
    }
    this.repMaxService.setPercentEffort(updatedExercise, recordMax);
    this.workout.exercises[exerciseIndex] = updatedExercise;
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

    // Set the url. If no datestring provided, use current date.
    let url: string;
    if (dateString) {
      this.workout.date = dateString
      dateString = dateString.split(' ').join('%20');
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + dateString + '.json'
    } else {
      const date = new Date().toLocaleString()
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + date + '.json'
    }


    this.http.get(url).subscribe(
      (workout: Workout) => {
        if (workout) {
          workout.exercises.forEach(exercise => {

            // Check each exercise has a recordMax. If not, then calculate and set it.
            let recordMax = this.repMaxService.getRecordMaxFromName(exercise.exerciseName)
            if (!recordMax) {
              recordMax = this.repMaxService.calculateBestMax(exercise);
              this.repMaxService.recordMaxes[exercise.exerciseName] = recordMax;
            }

            // Set the percent effort.
            this.repMaxService.setPercentEffort(exercise, recordMax)
          })

          // Set the official workout and send out the subscription.
          this.workout = workout;
          this.exerciseUpdated.next(this.workout.exercises)
        }
      }
    )
  }

  // Note...test runtime for this in two different condition
  // 1) Calling repMaxService inside the foreach
  // 2) Calling repMaxService, and its own method uses forEach (current implementation)
  setPercentEffort() {
    this.workout.exercises.forEach(exercise => {
      this.repMaxService.setPercentEffort(
        exercise, this.repMaxService.getRecordMaxFromName(exercise.exerciseName)
        );
    })
    this.exerciseUpdated.next(this.workout.exercises)
  }


  getExercisesByName(exerciseName: string) {
    let exercises = this.workout.exercises
    exercises.forEach((exercise: Exercise) => {
      if (exercise.exerciseName == exerciseName) {
        return exercise;
      } else {
        return null;
      }
    })
  }

  checkExerciseHasRecord(exerciseName: string) {
    return this.repMaxService.getRecordMaxFromName(exerciseName)
  }



}

