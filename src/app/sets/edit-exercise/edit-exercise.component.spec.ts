// import { ComponentFixture, TestBed } from "@angular/core/testing";
// import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { MatAutocompleteModule } from "@angular/material/autocomplete";
// import { MatDialogModule } from "@angular/material/dialog";
// import { MatSnackBarModule } from "@angular/material/snack-bar";
// import { ActivatedRoute } from "@angular/router";
// import { RouterTestingModule } from "@angular/router/testing";
// import { of } from "rxjs";
// import { RepmaxService } from "src/app/repmax.service";
// import { RepmaxServiceStub } from "src/app/shared/mocks/repmax.service.mock";
// import { WorkoutServiceStub } from "src/app/shared/mocks/workout.service.mock";
// import { WorkoutService } from "src/app/workout.service";
// import { EditExerciseComponent } from "./edit-exercise.component"

// describe("edit-exercise, edit mode", () => {
// 	let editExercise: EditExerciseComponent;
// 	let fixture: ComponentFixture<EditExerciseComponent>;

// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			imports: [
// 				RouterTestingModule,
// 				MatSnackBarModule,
// 				FormsModule,
// 				ReactiveFormsModule,
// 				MatDialogModule,
// 				MatAutocompleteModule
// 			],
// 			declarations: [EditExerciseComponent],
// 			providers: [
// 				{ provide: WorkoutService, useClass: WorkoutServiceStub },
// 				{ provide: RepmaxService, useClass: RepmaxServiceStub },
// 				{
// 					provide: ActivatedRoute,
// 					useValue: {
// 						snapshot: {
// 							params: { exerciseId: 2 }
// 						},
// 						params: of({ exerciseId: 2 })
// 					}
// 				}
// 			]
// 		});

// 		fixture = TestBed.createComponent(EditExerciseComponent);
// 		editExercise = fixture.debugElement.componentInstance;
// 		let workoutService = fixture.debugElement.injector.get(WorkoutService);
// 		workoutService.workout = {
// 			date: "Nov 05 2020",
// 			category: '',
// 			bodyweight: 170,
// 			exercises: [
// 				{
// 					exerciseName: 'Bench Press',
// 					setType: 'rpd',
// 					exerciseNotes: 'bench press notes',
// 					momentaryMax: 200,
// 					warmupSets: [],
// 					sets: [{ weight: 200, reps: 1 }]
// 				},
// 				{
// 					exerciseName: 'Squat',
// 					setType: 'mtor',
// 					exerciseNotes: 'squat notes',
// 					momentaryMax: 275,
// 					warmupSets: [],
// 					sets: [{ weight: 275, reps: 1 }]
// 				},
// 				{
// 					exerciseName: 'Deadlift',
// 					setType: 'clusters',
// 					exerciseNotes: 'deadlift notes',
// 					momentaryMax: 300,
// 					warmupSets: [],
// 					sets: [{ weight: 300, reps: 1 }]
// 				},
// 			],
// 			notes: ''
// 		};
// 	});

// 	it('should create the EditExercise Component', () => {
// 		expect(editExercise).toBeTruthy();
// 	});

// 	it('should have editMode = true', () => {
// 		editExercise.ngOnInit();
// 		expect(editExercise.editMode).toEqual(true);
// 	});



// })