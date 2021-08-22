import { Component, OnInit, OnDestroy } from "@angular/core";
import { WorkoutService } from "../../workout.service";
import { Exercise } from "../../shared/exercise.model";
import { Subscription, Observable, Subject } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RepmaxService } from "src/app/repmax.service";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Workout } from "src/app/shared/workout.model";
import { takeUntil } from "rxjs/operators";

@Component({
	selector: 'app-setList',
	templateUrl: './setList.component.html',
	styleUrls: ['./setList.component.scss']
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
	 * The user's bodyweight for this workout. Updated by sub when a new workout is loaded.
	 */
	bodyweight: number;
	/**
	 * Used for updating the user's bodyweight.
	 */
	bodyweightSub: Subscription;
	/**
	 * An array of reccord maxes for the component's exercises. For display purposes only.
	 */
	recordMaxArray = [];
	/**
	 * The current date. Updated by the paramsSub
	 */
	date: Date; // The date of the loaded workout
	/**
	 * Sub for the route's date-params.
	 */
	paramsSub: Subscription;


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

		this.date = new Date(
			this.activatedRoute.snapshot.queryParams['dateString']
		);

		this.workoutService.fetchWorkout(this.date)

		// Attempt to fetch a workout if the service has none. The exercises/bodyweight subscription will  be received
		if (!this.workoutService.getWorkout()) {
			console.log("No workout found. Calling workout service with route params..");
			this.handleRouteParams();
		}
		else if (this.date !== this.workoutService.getWorkout().date) {
			console.log("Dates don't match! Calling workout service with route params...");
			console.log(this.date + ' vs. ' + this.workoutService.getWorkout().date)
			this.handleRouteParams();
		}
		else {
			this.exercises = this.workoutService.getWorkout().exercises
		}

		// If record maxes not loaded, then get them.
		if (!this.repMaxService.recordMaxes) {
			console.log("repmax Service has no records. Calling service...")
			this.repMaxService.fetchRecords(); // This needs to happen in order to populate the recordMaxArray
		}

		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// ~~~~~~~~~~~~~~~ TODO: FIX the aync propblem with day records ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
		// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

		// Populate the record-max array. These values are displayed with each exercise.
		console.log("Populating record max array...")
		this.exercises.forEach(exercise => {
			console.log(exercise + " populating...")
			this.recordMaxArray.push(
				this.repMaxService.getRecordMaxFromName(exercise.exerciseName)
			)
		});

		console.log("INIT COMPLETE: SetListComponent")
	}
	/**
	 * Setup Subscriptions for  exercise array and bodyweight (and unsubscribes)...
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

	}

	/**
	 * Setup the params subscription. This will also trigger the functions designated in the subscription.
	 * Also setup unsubscribe.
	 */
	private handleRouteParams() {
		console.log("METHOD: HANDLE ROUTE PARAMS")
		this.paramsSub = this.activatedRoute.queryParams
		.pipe(takeUntil(this.unsubNotifier))
		.subscribe(
			(params: Params) => {
				this.date = new Date( params['dateString'] );
				this.workoutService.fetchWorkout(this.date);
			}
		)
		console.log("CLOSED: HANDLE ROUTE PARAMS")
	}

	ngOnDestroy() {
		console.log("DESTROY: SetListCompononent")
		this.unsubNotifier.next();
		this.unsubNotifier.complete();
		this.workoutService.getWorkout().bodyweight = this.bodyweight;
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
		this.workoutService.getWorkout().bodyweight = this.bodyweight;
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

		this.repMaxService.patchDayMaxes(this.workoutService.getWorkout());
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
	// getRecordMax(exerciseName): number {
	// 	return this.repMaxService.getRecordMaxFromName(exerciseName)
	// }

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
		return this.workoutService.getWorkout().exercises.length;
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
