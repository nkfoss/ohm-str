import { Component, OnInit, OnDestroy } from "@angular/core";
import { WorkoutService } from "../../workout.service";
import { Exercise } from "../../shared/exercise.model";
import { Subscription, Observable } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RepmaxService } from "src/app/repmax.service";
import { RepMaxRecord } from "src/app/shared/repMaxRecord.model";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Workout } from "src/app/shared/workout.model";

@Component({
	selector: 'app-setList',
	templateUrl: './setList.component.html',
	styleUrls: ['./setList.component.css']
})


// =====================================================

export class SetListComponent implements OnInit, OnDestroy {

	//#region === Properties ====================================================

	exercises: Exercise[];
	exerciseSub: Subscription;
	todaysMaxes: RepMaxRecord[];
	todaysMaxesSub: Subscription;

	bodyweight: number;

	date: string; // The date of the loaded workout

	//#endregion

	//#region === Lifecycle Hooks ===============================================

	constructor(
		private workoutService: WorkoutService,
		private repMaxService: RepmaxService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private _snackBar: MatSnackBar) { }

	ngOnInit() {
		console.log("INIT: SetListComponent")

		let workoutBW = this.workoutService.workout.bodyweight;
		if (workoutBW) {
			this.bodyweight = workoutBW;
		} else {
			this.bodyweight = null;
		}

		// Setup sub for repMaxes
		this.todaysMaxesSub = this.repMaxService.todaysMaxesUpdated.subscribe(
			(updatedTodaysMaxes: RepMaxRecord[]) => { this.todaysMaxes = updatedTodaysMaxes; }
		);
		this.repMaxService.fetchRecords()

		// Set up exercise subscription and fetch workout from DB for this date.
		this.getDateFromRoute();
		this.exerciseSub = this.workoutService.exerciseUpdated.subscribe(
			(updatedExercises: Exercise[]) => { this.exercises = updatedExercises; }
		);
		if (this.workoutService.getExercises().length < 1) { this.workoutService.fetchWorkout(this.date); }
		//  NOTE: The above line is important for updating the exercise list after edit/adding exercises.
		// 	However, it will need to be removed if I ever fix the navigate-to-today problem.
		//  	(this is the problem where the old exercises (if any) are still displayed after navigating to today)

		console.log("INIT COMPLETE: SetListComponent")
	}

	ngOnDestroy() {
		if (this.exerciseSub) { this.exerciseSub.unsubscribe() }
		if (this.todaysMaxesSub) { this.todaysMaxesSub.unsubscribe() }
		this.workoutService.workout.bodyweight = this.bodyweight;
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

	getDateFromRoute() {
		this.activatedRoute.url.subscribe(url => {
			this.date = url[1].toString();
			this.date = this.date.split('%20').join(' ');
		});
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