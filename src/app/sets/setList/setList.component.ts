import { Component, OnInit, OnDestroy } from "@angular/core";
import { WorkoutService } from "../../workout.service";
import { Exercise } from "../../shared/exercise.model";
import { Subscription, Observable, Subject } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RepmaxService } from "src/app/repmax.service";
import { RepMaxRecord } from "src/app/shared/repMaxRecord.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Workout } from "src/app/shared/workout.model";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: 'app-setList',
	templateUrl: './setList.component.html',
	styleUrls: ['./setList.component.css']
})


// =====================================================

export class SetListComponent implements OnInit, OnDestroy {

	//#region === Properties ===================================================================================

	/**
	 * Used once during OnDestroy(). Automatically unsubscribes from all subscriptions.
	 */
	unsubNotifier = new Subject();
	/**
	 * An array of exercises for the selected date's workout. Used for display purposes only.
	 */
	exercises: Exercise[];
	/**
	 * Used for updating the component's exercise array. Receives updates from the WorkoutService.
	 */
	exerciseSub: Subscription;

	/**
	 * The user's bodyweight for this workout.
	 */
	bodyweight: number;
	/**
	 * Used for updating the user's bodyweight. Updated when a new workout is loaded.
	 */
	bodyweightSub: Subscription;
	/**
	 * An array of reccord maxes for the component's exercises. For display purposes only.
	 */
	recordMaxArray = [];
	/**
	 * The current date. Retrieved from the activated route.
	 */
	date: string; // The date of the loaded workout
	// dateSub: Subscription;

	//#endregion
	//#region === Lifecycle Hooks ===================================================================================

	constructor(
		private workoutService: WorkoutService,
		private repMaxService: RepmaxService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private _snackBar: MatSnackBar
	) { }

	ngOnInit() {
		console.log("INIT: SetListComponent");

		this.setupSubs();
		this.handleRouteParams();

		// Attempt to fetch a workout if the service has none. The exercises/bodyweight subscription will  be received
		if (!this.workoutService.workout) {
			console.log("No workout found");
			this.workoutService.fetchWorkout(this.date);
		} 
		else if (this.date !== this.workoutService.workout.date) {
			console.log("Dates don't match... " + this.date + ' _ ' + this.workoutService.workout.date);
			this.workoutService.fetchWorkout(this.date)
		}

		// If record maxes not loaded, then get them. 
		if (!this.repMaxService.recordMaxes) {
			this.repMaxService.fetchRecords(); // This needs to happen in order to populate the recordMaxArray
		}

		// Populate the record-max array. These values are displayed with each exercise.
		this.exercises.forEach(exercise => {
			this.recordMaxArray.push(this.getRecordMax(exercise.exerciseName))
		});

		console.log("INIT COMPLETE: SetListComponent")
	}
	/**
	 * Setup Subscriptions for exercise array, bodyweight, and current date.
	 * Also automate unsubscribe for OnDestroy()
	 */
	private setupSubs() {

		this.exerciseSub = this.workoutService.exerciseUpdated
			.pipe(takeUntil(this.unsubNotifier))
			.subscribe(
				(updatedExercises: Exercise[]) => { this.exercises = updatedExercises; }
			);

		this.bodyweightSub = this.workoutService.bodyweightUpdated
			.pipe(takeUntil(this.unsubNotifier))
			.subscribe(
				(updatedBodyweight: number) => { this.bodyweight = updatedBodyweight }
			);

		// this.dateSub = this.workoutService.dateUpdated
		// 	.pipe(takeUntil(this.unsubNotifier))
		// 	.subscribe(
		// 		(updatedDate: string) => { 
		// 			this.date = updatedDate;
		// 		}	
		// 	);
	}
	/**
	 * Extract the date param from the route, and also setup the params subscription.
	 * This enables the SLC to update the exercise array when the date is changed,
	 * but without having to reload the comp.
	 */
	private handleRouteParams() {
		this.date = this.activatedRoute.snapshot.params['date'];
		this.activatedRoute.params
		.subscribe(
			(params: Params) => {
				this.date = params['date'];
				this.workoutService.fetchWorkout(this.date);
			}
		)
	}

	ngOnDestroy() {
		console.log("DESTROY: SetListCompononent")

		this.unsubNotifier.next();
		this.unsubNotifier.complete();
		this.workoutService.workout.bodyweight = this.bodyweight;

		console.log("DESTROY COMPLETE: SetListCompononent")
	}
	//#endregion
	//#region === Functions =====================================================

	/**
	 * 1.) Sets the workout's bodyweight... 2.) Asks the WorkoutService to store the workout in the database.
	 * Also sets up a subscription for the service's response, which opens a snackbar that indicates success or failure...
	 * 3.) Updates the day-maxes for in the database... 4.) Updates the all-time maxes in the database.
	 */
	onSaveWorkout() {
		this.workoutService.workout.bodyweight = this.bodyweight;
		let workoutObs: Observable<Workout> = this.workoutService.storeWorkout();
		workoutObs.subscribe(
			resData => {
				console.log(resData);
				this.openSnackBar("Workout saved successfully.")
			},
			errorMessage => {
				this.openSnackBar(errorMessage)
			}
		)

		this.repMaxService.patchDayMaxes(this.workoutService.workout);
		this.repMaxService.patchRecordMaxes(this.repMaxService.recordMaxes);
	}

	/**
	 * Button function. Navigates to the EditExercise component to create a new exercise.
	 */
	onNewExercise() {
		this.router.navigate(['exercise/new'])
	}

	/**
	 * Button function. Navigates to the EditExercise component to edit an existing exercise.
	 * @param exerciseIndex - For the WorkoutService, the index of the exercise selected from the Exercise array.
	 */
	onEditExercise(exerciseIndex) {
		this.router.navigate(['exercise/' + exerciseIndex + '/edit'])
	}

	/**
	 * Asks the RepMaxService for the record (calculated) 1rm of an exercise.
	 * @param exerciseName - The name of the exercise to lookup.
	 * @returns The record calculated 1rm of the exercise
	 */
	getRecordMax(exerciseName): number {
		return this.repMaxService.getRecordMaxFromName(exerciseName)
	}

	/**
	 * Calculates the 1rm using the Epley formula. Source:
	 * https://en.wikipedia.org/wiki/One-repetition_maximum
	 * @param reps - The number of reps.
	 * @param weight - The amount of weight used.
	 */
	calculateMax(reps: number, weight: number) {
		let unrounded = weight * (1 + (reps / 30));
		return +unrounded.toFixed(2)
	}

	getExercisesLength() {
		return this.workoutService.workout.exercises.length;
	}

	/**
	 * Open the snackbar for three seconds with a message.
	 * @param responseMessage - The message to be displayed.
	 */
	private openSnackBar(responseMessage: string) {
		this._snackBar.open(
			responseMessage,
			'dismiss',
			{ duration: 3000 }
		)
	}

	//#endregion  

}