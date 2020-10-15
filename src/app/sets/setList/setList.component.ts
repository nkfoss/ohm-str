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

	//-------------------------------------------------------
	ngOnInit() {
		console.log("INIT: SetListComponent")

		this.setupSubs();
		this.setDateFromRoute();

		// Only attempt to fetch a workout if the service has none.
		if (this.workoutService.getExercises().length < 1) {
			this.workoutService.fetchWorkout(this.date);
		}

		// Only attempt to fetch records if the service has none.
		if (!this.repMaxService.recordMaxes) {
			this.repMaxService.fetchRecords(); // This needs to happen in order to populate the recordMaxArray
		}

		// Populate the record-max array. These values are for display only.
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
	}
	
	private setDateFromRoute() {
		this.activatedRoute.url.subscribe(url => {
			this.date = url[1].toString();
			this.date = this.date.split('%20').join(' ');
		});
	}
	//-------------------------------------------------------


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