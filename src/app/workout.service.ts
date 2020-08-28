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
    console.log("METHOD: addExercise()")

    newExercise.exerciseName = newExercise.exerciseName.toLowerCase();

    if (newExercise.sets.length > 0 
      && newExercise.setType !== "clusters" 
      && newExercise.setType !== "mtor") {

      let bestSet = this.repMaxService.calculateBestMax(newExercise);
      let recordMax = this.repMaxService.getRecordMaxFromName(newExercise.exerciseName);

      if (!recordMax) {
        this.repMaxService.setPercentEffort(newExercise, bestSet) 
        this.repMaxService.recordMaxes[newExercise.exerciseName] = bestSet;
      }
      else if (bestSet > recordMax) {
        this.repMaxService.setPercentEffort(newExercise, recordMax) 
        this.repMaxService.updatedRecordMaxes[newExercise.exerciseName] = bestSet;
      }
      else {
        this.repMaxService.setPercentEffort(newExercise, recordMax)
      }
    }

    this.workout.exercises.push(newExercise);
    this.exerciseUpdated.next(this.getExercises())

    console.log("CLOSED: addExercise()")
  }

  updateExercise(exerciseIndex: number, updatedExercise: Exercise) {
    console.log("METHOD: updateExercise()")

    updatedExercise.exerciseName = updatedExercise.exerciseName.toLowerCase();
    if (updatedExercise.sets.length > 0) {

      let bestSet = this.repMaxService.calculateBestMax(updatedExercise);
      let recordMax = this.repMaxService.getRecordMaxFromName(updatedExercise.exerciseName);

      if (!recordMax) {
        this.repMaxService.setPercentEffort(updatedExercise, bestSet) 
        this.repMaxService.recordMaxes[updatedExercise.exerciseName] = bestSet;
      }
      else if (bestSet > recordMax) {
        this.repMaxService.setPercentEffort(updatedExercise, recordMax) 
        this.repMaxService.updatedRecordMaxes[updatedExercise.exerciseName] = bestSet;
      }
      else {
        this.repMaxService.setPercentEffort(updatedExercise, recordMax)
      }
    }

    this.workout.exercises[exerciseIndex] = updatedExercise;
    this.exerciseUpdated.next(this.getExercises())

    console.log("CLOSED: updateExercise()")
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
  getRecordNames(): string[] {
    return this.repMaxService.getRecordNames();
  }

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
    console.log("METHOD: fetchWorkout")

    // Set the url. If no datestring provided, use current date.
    let url: string;
    if (dateString) {
      this.workout.date = dateString
      let URLdateString = dateString.split(' ').join('%20');
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + URLdateString + '.json'
    } else {
      const date = new Date().toLocaleString()
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + date + '.json'
    }

    console.log("URL " + url)
    this.http.get(url).subscribe(
      (workout: Workout) => {
        if (workout) {
          console.log('workout fetched')
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
          console.log('fetched workout: ' + workout)
          this.exerciseUpdated.next(this.workout.exercises)
        }

        else {
          // If no workout is returned, then we just set the displayed data to null
          let emptyWorkout: Workout = {
            date: dateString,
            category: "",
            notes: "",
            exercises: []
          }
          this.workout = emptyWorkout;
          this.exerciseUpdated.next(this.workout.exercises);
        }
      }
    )
    console.log("CLOSED: fetchWorkout")

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

