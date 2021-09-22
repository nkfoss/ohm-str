import { Injectable } from "@angular/core";
import { Exercise } from "./shared/exercise.model";
import { Workout } from "./shared/workout.model";
import { BehaviorSubject, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { RepmaxService } from "./repmax.service";
import { catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})

// ============================================
export class WorkoutService {
  //#region === Properties =======================================================

  exerciseUpdated = new BehaviorSubject<Exercise[]>(null);
  bodyweightUpdated = new BehaviorSubject<number>(null);

  workout: Workout;

  //#endregion

  //#region === Lifecycle Hooks ==================================================

  constructor(private http: HttpClient, private repMaxService: RepmaxService) {}

  //#endregion

  //#region === Database Functions ===============================================

  fetchWorkout(dateString?: string) {
	if (!dateString) {
    	dateString = new Date().toLocaleDateString();
    }

    const url = this.formatURL(dateString);
    this.http.get<Workout>(url).subscribe(
    	(fetchedWorkout: Workout) => {
        	this.workout = fetchedWorkout
          	? fetchedWorkout
          	: {
              	dateString: dateString,
              	category: "",
              	notes: "",
              	exercises: [],
              	bodyweight: null,
            };
        	this.exerciseUpdated.next(this.getWorkout().exercises);
        	this.bodyweightUpdated.next(this.getWorkout().bodyweight);
      	},
    	error => {
        	console.log(error);
      	}
    );
  }

  private formatURL(dateString: string): string {
    let date = new Date(dateString);
	let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    const url = `https://strengthpractice-7e443.firebaseio.com/workouts/${year}/${month}/${day}.json`;
    return url;
  }

  storeWorkout() {
    this.convertToLowerCase(this.workout.exercises);
    let url = this.formatURL(this.workout.dateString)
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
    const errMsg = "ERROR: " + statusCode + " " + statusText;
    // Logic for handling specific error codes
    return throwError(errMsg);
  }

  //#endregion

  //#region === Other Functions ==================================================

  getWorkout() {
    return this.workout;
  }

  getExercises() {
    return this.workout.exercises.slice();
  }

  getExercise(exerciseIndex: number): Exercise {
    return { ...this.workout.exercises[exerciseIndex] };
  }

  addExercise(newExercise: Exercise) {
    newExercise.exerciseName = newExercise.exerciseName.toLowerCase();
    this.handleRecordAndEffort(newExercise);
    this.workout.exercises.push(newExercise);
    this.exerciseUpdated.next(this.getExercises());
  }

  updateExercise(exerciseIndex: number, updatedExercise: Exercise) {
    updatedExercise.exerciseName = updatedExercise.exerciseName.toLowerCase();
    this.handleRecordAndEffort(updatedExercise);
    this.workout.exercises[exerciseIndex] = updatedExercise;
    this.exerciseUpdated.next(this.getExercises());
  }

  // Set percent effort (and record max if applicable).
  private handleRecordAndEffort(exercise: Exercise) {
    // NEVER calculate a reocrd-max from a cluster or mtor set.
    if (
		exercise.sets.length > 0 &&
		exercise.setType !== "clusters" &&
		exercise.setType !== "mtor"
    ) {
		const bestSetMax = this.repMaxService.calculateBestMax(exercise);
		const recordMax = exercise.momentaryMax;
		
		if (!recordMax) { // If no existing record, create one...
			this.repMaxService.setPercentEffort(exercise, bestSetMax); // Use bestSetMax instead of recordMax
			this.repMaxService.recordMaxes[exercise.exerciseName] = bestSetMax;
		} else if (bestSetMax > recordMax) {
			this.repMaxService.setPercentEffort(exercise, recordMax);
			this.repMaxService.updatedRecordMaxes[exercise.exerciseName] =
			bestSetMax;
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
    exercises.forEach((exercise) => {
      	exercise.exerciseName = exercise.exerciseName.toLowerCase();
    });
  }

  // Note...test runtime for this in two different condition
  // 1) Calling repMaxService inside the foreach
  // 2) Calling repMaxService, and its own method uses forEach (current implementation)
  setPercentEffort() {
    this.workout.exercises.forEach((exercise) => {
		this.repMaxService.setPercentEffort(
			exercise,
			this.repMaxService.getRecordMaxFromName(exercise.exerciseName)
		);
    });
    this.exerciseUpdated.next(this.workout.exercises);
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
