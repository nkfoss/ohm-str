import { Component } from "@angular/core";
import { WorkoutService } from "../../workout.service";
import { Exercise } from "../../shared/exercise.model";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute, Params } from "@angular/router";

@Component({
	selector: 'app-setList',
	templateUrl: './setList.component.html',
	styleUrls: ['./setList.component.css']
})


// =====================================================

export class SetListComponent {

	exercises: Exercise[];
	exerciseSub: Subscription;

	isNavbarCollapsed = true;
	date: string;


	// =====================================================

	constructor(
		private workoutService: WorkoutService,
		private router: Router,
		private activatedRoute: ActivatedRoute) { }

	ngOnInit() {

		// First retrieve date from route, and format it for the service.
		this.activatedRoute.url.subscribe(url => {
			this.date = url[1].toString();
			this.date = this.date.split('%20').join(' ');
			this.workoutService.fetchWorkout(this.date);
		});

		// fetch exercises using the date string.
		this.exerciseSub = this.workoutService.exerciseUpdated.subscribe(
			(updatedExercises: Exercise[]) => {
				this.exercises = updatedExercises
			}
		)
	}

	ngOnDestroy() { if (this.exerciseSub) { this.exerciseSub.unsubscribe() } }


	// =====================================================

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

}