import { Component } from "@angular/core";
import { WorkoutService } from "../../workout.service";
import { Exercise } from "../../shared/exercise.model";
import { Subscription } from "rxjs";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
	selector: 'app-setList',
	templateUrl: './setList.component.html',
	styleUrls: ['./setList.component.css']
})

// =====================================================


export class SetListComponent {

	exercises: Exercise[];
	exercisesSub: Subscription;

	isNavbarCollapsed = true;
	date: String;

	// =====================================================


	constructor(private workoutService: WorkoutService,
				private router: Router,
				private activatedRoute: ActivatedRoute) {}

	ngOnInit() {
		this.exercises = this.workoutService.getExercises();
		this.exercisesSub = this.workoutService.exerciseUpdated.subscribe(
			(updatedExercises: Exercise[]) => {
				this.exercises = updatedExercises
			}
		)
		this.date = this.workoutService.getFormattedDate();
	}

	ngOnDestroy() { this.exercisesSub.unsubscribe() }

	// =====================================================

	onDeleteSet(exerciseIndex, setIndex) {
		this.workoutService.deleteSet(exerciseIndex, setIndex)
	}

	onNewExercise() {
		this.router.navigate(['new'], {relativeTo: this.activatedRoute})
	}

	onEditExercise(exerciseIndex) {
		this.router.navigate( [exerciseIndex + '/edit'], {relativeTo: this.activatedRoute} )
	}
	
}