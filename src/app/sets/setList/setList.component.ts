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

	unsubNotifier = new Subject();

	exercises: Exercise[];
	exerciseSub: Subscription;

	bodyweight: number;
	bodyweightSub: Subscription;

	recordMaxArray = [];

	date: string; // The date of the loaded workout

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

	private setupSubs() {
		// Setup subscriptions for rep-maxes, exercises, and bodyweight.
		// Also automate the unsubscribe.

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

	onNewExercise() {
		this.router.navigate(['exercise/new'])
	}

	onEditExercise(exerciseIndex) {
		this.router.navigate(['exercise/' + exerciseIndex + '/edit'])
	}

	getRecordMax(exerciseName) {
		return this.repMaxService.getRecordMaxFromName(exerciseName)
	}

	calculateMax(reps: number, weight: number) {
		let unrounded = weight * (1 + (reps / 30));
		return +unrounded.toFixed(2)
	}

	getExercisesLength() {
		return this.workoutService.workout.exercises.length;
	}

	// This snackbar is opened after the workout service attempts to store the workout.
	private openSnackBar(responseMessage: string) {
		this._snackBar.open(
			responseMessage,
			'dismiss',
			{ duration: 3000 }
		)
	}

	//#endregion  

}