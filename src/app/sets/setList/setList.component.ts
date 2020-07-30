import { Component, OnInit, DoCheck, OnDestroy, AfterContentInit } from "@angular/core";
import { WorkoutService } from "../../workout.service";
import { Exercise } from "../../shared/exercise.model";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { RepmaxService } from "src/app/repmax.service";
import { RepMaxRecord } from "src/app/shared/repMaxRecord.model";

@Component({
	selector: 'app-setList',
	templateUrl: './setList.component.html',
	styleUrls: ['./setList.component.css']
})


// =====================================================

export class SetListComponent implements OnInit, OnDestroy{

	exercises: Exercise[];
	exerciseSub: Subscription;
	todaysMaxes: RepMaxRecord[];
	todaysMaxesSub: Subscription;
	percentEffortArray: number[] = [];

	isNavbarCollapsed = true;
	date: string;


	// =====================================================

	constructor(
		private workoutService: WorkoutService,
		private repMaxService: RepmaxService,
		private router: Router,
		private activatedRoute: ActivatedRoute) { }

	ngOnInit() {

		// Setup sub for repMaxes
		this.todaysMaxesSub = this.repMaxService.todaysMaxesUpdated.subscribe((updatedTodaysMaxes: RepMaxRecord[]) => { 
				this.todaysMaxes = updatedTodaysMaxes;
				console.log(this.todaysMaxes)
			}
		)
		this.repMaxService.fetchRecords()

		// Set up exercise subscription and fetch workout from DB for this date.
		this.getDateFromRoute()
		this.exerciseSub = this.workoutService.exerciseUpdated.subscribe(
			(updatedExercises: Exercise[]) => { 
				this.exercises = updatedExercises  
			 }
		)
		if (this.workoutService.getExercises().length < 1) { this.workoutService.fetchWorkout(this.date); }



	}

	ngOnDestroy() { if (this.exerciseSub) { this.exerciseSub.unsubscribe() } }


	// =====================================================

	getDateFromRoute() {
		this.activatedRoute.url.subscribe(url => {
			this.date = url[1].toString();
			this.date = this.date.split('%20').join(' ');
		});
	}

	onDeleteSet(exerciseIndex, setIndex) {
		this.workoutService.deleteSet(exerciseIndex, setIndex)
	}

	onNewExercise() {
		this.router.navigate(['exercise/new'])
	}

	onEditExercise(exerciseIndex) {
		this.router.navigate(['exercise/' + exerciseIndex + '/edit'])
	}

	onSaveWorkout() {
		this.workoutService.storeWorkout();
	}

	calculateMax(reps: number, weight: number) {
		let unrounded = weight * (1 + (reps / 30));
		return +unrounded.toFixed(2)
	}

	setPercentEffort() {
		this.exercises.forEach(exercise => {
			exercise.sets.forEach(set => {
				
			})
		})
	}

	asd() {
		this.repMaxService.asdMethod()
	}


}