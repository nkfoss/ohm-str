import { Injectable } from '@angular/core';
import { Exercise } from './shared/exercise.model';
import { Workout } from './shared/workout.model';
import { BehaviorSubject, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RepmaxService } from './repmax.service';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

// ============================================

export class WorkoutService {

  //#region === Properties =======================================================

  exerciseUpdated = new BehaviorSubject<Exercise[]>(null);
  bodyweightUpdated = new BehaviorSubject<number>(null);

  private workout: Workout;
  private date: string;

  //#endregion

  //#region === Lifecycle Hooks ==================================================

  constructor(
    private http: HttpClient,
    private repMaxService: RepmaxService
    ) { }

  //#endregion

  //#region === Database Functions ===============================================


  fetchWorkout(date?: Date) {
    if (!date) {
      date = new Date();
    }
    const url = this.formatURL(date);

    this.http.get<Workout>(url)
    .subscribe(
      (fetchedWorkout) => {
        if (fetchedWorkout instanceof Workout) {
          this.handleWorkoutsResponse(fetchedWorkout, date);
          this.exerciseUpdated.next(this.workout.exercises);
          this.bodyweightUpdated.next(this.workout.bodyweight);
        } else if (Object.keys(fetchedWorkout).includes("date")) {
          let dateString: String = fetchedWorkout['date'];
          let dateSplit = dateString.split(' ');
          let month = dateSplit[0] == "May" 
            ? 4 : dateSplit[0] == "Jun"
            ? 5 : 6
          let date = new Date()
          date.setFullYear(2021, month, +dateSplit[1])
          let newWorkout: Workout = {
            date: date,
            category: "",
            notes: fetchedWorkout["notes"],
            exercises: fetchedWorkout["exercises"],
            bodyweight: fetchedWorkout["bodyweight"]
          }
          this.handleWorkoutsResponse(newWorkout, date);
          this.exerciseUpdated.next(this.workout.exercises);
          this.bodyweightUpdated.next(this.workout.bodyweight);
        }
      

      },
      (error) => {
        console.log(error)
      }
    )
  }

  private formatURL(date: Date): string {
    console.log("METHOD: FORMAT URL")
    const dateSplit = date.toDateString().split(' ').splice(1, 3);
    console.log("datesplit: " + dateSplit)
    const url = 
    'https://strengthpractice-7e443.firebaseio.com/workouts/' 
    + dateSplit[2]      // year
    + '/' + dateSplit[0]  // month
    + '/' + dateSplit[1]  // date
    + '.json'
    console.log(url)
    console.log("CLOSED: FORMAT URL")
    return url;
  }

  private handleWorkoutsResponse(workout: Workout, date: Date) {
    console.log("METHOD: HANDLE FETCHED WORKOUT")
    if (workout) {
      this.workout = workout;
    } else {
      this.workout = {
        date: date,
        category: "",
        notes: "",
        exercises: [],
        bodyweight: null
      };
    }
  }

  storeWorkout() {

    this.convertToLowerCase(this.workout.exercises)
    if (!(this.workout.date instanceof Date)) {
      this.workout.date = this.convertDateStringToDate(this.workout.date)
    }

    console.log(this.workout.date)

    let year = this.workout.date.getFullYear();
    let month = this.workout.date.getMonth() + 1;
    let day = this.workout.date.getDate();
    const url = 'https://strengthpractice-7e443.firebaseio.com/workouts/' 
      + year + "/" + month + "/" + day
      + '.json';

    console.log(url)

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


  convertDateStringToDate(dateString: String): Date {
    let dateSplit = dateString.split(' ');
    let qwe;
    switch(dateSplit[0]) {
      case "Jan":
        qwe = 0; break;
      case "Feb":
        qwe = 1; break;
      case "Mar":
        qwe = 2; break;
      case "Apr":
        qwe = 3; break;
      case "May":
        qwe = 4; break;
      case "Jun":
        qwe = 5; break;
      case "Jul":
        qwe = 6; break;
      case "Aug":
        qwe = 7; break;
      case "Sep":
        qwe = 8; break;
      case "Oct":
        qwe = 9; break;
      case "Nov":
        qwe = 10; break;
      case "Dec":
        qwe = 11; break;
    }
    console.log(dateSplit[2])
    console.log(qwe)
    console.log(dateSplit[0])
    return new Date(+dateSplit[2], qwe, +dateSplit[1])
  }

}

