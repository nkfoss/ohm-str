import { Injectable } from '@angular/core';
import { Exercise } from './shared/exercise.model';
import { Workout } from './shared/workout.model';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RepmaxService } from './repmax.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

// ============================================

export class WorkoutService {

  //#region === Properties =======================================================

  exerciseUpdated = new BehaviorSubject<Exercise[]>(null);
  bodyweightUpdated = new BehaviorSubject<number>(null);
  dateUpdated = new BehaviorSubject<string>(null);

  workout: Workout;
  date: string;

  //#endregion

  //#region === Lifecycle Hooks ==================================================

  constructor(
    private http: HttpClient,
    private repMaxService: RepmaxService
    ) { }

  //#endregion

  //#region === Database Functions ===============================================

  fetchWorkout(dateString?: string) {
    console.log('METHOD: fetchWorkout');

    if (dateString) {
      this.date = dateString;
      this.dateUpdated.next(this.date);
    }

    const url = this.formatURL(dateString);

    this.http.get(url)
    .subscribe(
      (workout: Workout) => {
        this.handleFetchedWorkout(workout, dateString);
        this.exerciseUpdated.next(this.workout.exercises);
        this.bodyweightUpdated.next(this.workout.bodyweight);
      }
    );
    console.log('CLOSED: fetchWorkout');

  }

  private formatURL(dateString?: string): string {
    // Set the url. If no datestring provided, use current date.
    let url: string;
    if (dateString) {
      // this.workout.date = dateString;
      const URLdateString = dateString.split(' ').join('%20');
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + URLdateString + '.json';
    } else {
      const date = new Date().toLocaleString();
      url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + date + '.json';
    }
    return url;
  }

  private handleFetchedWorkout(workout?: Workout, dateString?: string) {
    if (workout) {
      // Set the official workout and send out the subscription.
      this.workout = workout;
      console.log('fetched workout: ' + workout);
    } else {
      // If no workout is returned, then we just set the displayed data to null
      console.log('no workout fetched');
      this.workout = {
        date: dateString,
        category: '',
        notes: '',
        exercises: [],
        bodyweight: null
      };
    }

  }

  storeWorkout() {
    this.convertToLowerCase(this.workout.exercises);
    const url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' + this.workout.date + '.json';
    return this.http.patch<Workout>(url, this.workout).pipe(
      catchError(this.handleErrorResponse)
      // We don't use 'tap' here, since tap only produces side-effects, which we don't need to do.
      // Without an error, the observable only wraps the response (a workout object),
      // which our component is equipped to handle.
    );
  }

  private handleErrorResponse(errRes: HttpErrorResponse) {
    const statusCode = errRes.status.toString();
    const statusText = errRes.statusText;
    const errMsg = 'ERROR: ' + statusCode + ' ' + statusText;
    // Logic for handling specific error codes
    return throwError(errMsg);
  }

  //#endregion

  //#region === Other Functions ==================================================

  getWorkout() { return this.workout; }

  getFormattedDate() { return this.workout.date; }

  getExercises() { return this.workout.exercises.slice(); }

  getExercise(exerciseIndex: number): Exercise { return { ...this.workout.exercises[exerciseIndex] }; }

  addExercise(newExercise: Exercise) {
    console.log('METHOD: addExercise()');

    newExercise.exerciseName = newExercise.exerciseName.toLowerCase();
    this.handleRecordAndEffort(newExercise);
    this.workout.exercises.push(newExercise);
    this.exerciseUpdated.next( this.getExercises() );

    console.log('CLOSED: addExercise()');
  }

  updateExercise(exerciseIndex: number, updatedExercise: Exercise) {
    console.log('METHOD: updateExercise()');

    updatedExercise.exerciseName = updatedExercise.exerciseName.toLowerCase();
    this.handleRecordAndEffort(updatedExercise);
    this.workout.exercises[exerciseIndex] = updatedExercise;
    this.exerciseUpdated.next(this.getExercises());

    console.log('CLOSED: updateExercise()');
  }

  // Set percent effort (and record max if applicable).
  private handleRecordAndEffort(exercise: Exercise) {

    // NEVER calculate a reocrd-max from a cluster or mtor set.
    if (exercise.sets.length > 0
      && exercise.setType !== 'clusters'
      && exercise.setType !== 'mtor') {

      const bestSetMax = this.repMaxService.calculateBestMax(exercise);
      const recordMax = exercise.momentaryMax;

      // If no existing record, create one...
      if (!recordMax) {
        this.repMaxService.setPercentEffort(exercise, bestSetMax); // Use bestSetMax instead of recordMax
        this.repMaxService.recordMaxes[exercise.exerciseName] = bestSetMax;
      } else if (bestSetMax > recordMax) {
        this.repMaxService.setPercentEffort(exercise, recordMax);
        this.repMaxService.updatedRecordMaxes[exercise.exerciseName] = bestSetMax;
      } else {
        this.repMaxService.setPercentEffort(exercise, recordMax);
      }
    }

  }

  deleteSet(exerciseIndex: number, setIndex: number) {
    this.workout.exercises[exerciseIndex].sets.splice(setIndex, 1);
    this.exerciseUpdated.next(this.getExercises());
  }

  deleteExercise(exerciseIndex: number) {
    this.workout.exercises.splice(exerciseIndex, 1);
    this.exerciseUpdated.next(this.getExercises());
  }

  getRecordNames(): string[] {
    return this.repMaxService.getRecordNames();
  }

  convertToLowerCase(exercises: Exercise[]) {
    exercises.forEach(exercise => {
      exercise.exerciseName = exercise.exerciseName.toLowerCase();
    });
  }

  // Note...test runtime for this in two different condition
  // 1) Calling repMaxService inside the foreach
  // 2) Calling repMaxService, and its own method uses forEach (current implementation)
  setPercentEffort() {
    console.log('METHOD: SetPercentEffort()');
    this.workout.exercises.forEach(exercise => {
      this.repMaxService.setPercentEffort(
        exercise, this.repMaxService.getRecordMaxFromName(exercise.exerciseName)
      );
    });
    this.exerciseUpdated.next(this.workout.exercises);
    console.log('CLOSED: SetPercentEffort()');
  }

  getExercisesByName(exerciseName: string) {
    const exercises = this.workout.exercises;
    exercises.forEach((exercise: Exercise) => {
      if (exercise.exerciseName === exerciseName) {
        return exercise;
      } else {
        return null;
      }
    });
  }

  checkExerciseHasRecord(exerciseName: string) {
    return this.repMaxService.getRecordMaxFromName(exerciseName);
  }

  //#endregion

}

