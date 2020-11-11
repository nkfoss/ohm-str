import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatDialogModule } from "@angular/material/dialog";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { RouterTestingModule } from "@angular/router/testing";
import { RepmaxService } from "src/app/repmax.service";
import { WorkoutService } from "src/app/workout.service";
import { EditExerciseComponent } from "./edit-exercise.component"

describe("edit-exercise", () => {
	let editExercise: EditExerciseComponent;
	let fixture: ComponentFixture<EditExerciseComponent>;

	let workoutServiceStub: {};
	let repMaxServiceStub: {};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				MatSnackBarModule,
				FormsModule,
				ReactiveFormsModule,
				MatDialogModule,
				MatAutocompleteModule
			],
			declarations: [EditExerciseComponent],
			providers: [
				{ provide: WorkoutService, useValue: workoutServiceStub },
				{ provide: RepmaxService, useValue: repMaxServiceStub }
			]
		});
	});

	it('should create the EditExercise Component', () => {
		let fixture = TestBed.createComponent(EditExerciseComponent);
		let EEC = fixture.debugElement.componentInstance;
		expect(EEC).toBeTruthy();
	})

})