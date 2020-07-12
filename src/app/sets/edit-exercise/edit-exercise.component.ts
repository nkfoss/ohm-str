import { Component, OnInit, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkoutService } from '../../workout.service';
import { Exercise } from '../../shared/exercise.model';

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.component.html',
  styleUrls: ['./edit-exercise.component.css']
})


//=========================================================================

export class EditExerciseComponent implements OnInit {

  public setsForm: FormGroup;
  exerciseId: number;
  editMode = false; // False when adding new exercise, false when editing existing

  stringSetType: string;

  //======================================================================

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private formBuilder: FormBuilder,
    private resolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.exerciseId = +params['exerciseId'];
        this.editMode = params['exerciseId'] != null;
      }
    );
    this.initForm()
  }

  // =============================================================================//

  private initForm() {

    // Initial values of the form fields
    let exerciseName = '';
    let setType = '';
    let warmupControlArray = new FormArray([]);
    let setsControlArray = new FormArray([]);

    if (this.editMode) { //======= EDIT MODE ======///

      // Get the target exercise object
      const exercise: Exercise = this.workoutService.getExercise(this.exerciseId);

      // From that, define a formgroup to be used with each warmup set
      if (exercise['warmupSets']) {
        for (let warmupSet of exercise.warmupSets) {
          warmupControlArray.push(
            new FormGroup({
              weight: new FormControl(warmupSet.weight, [Validators.required, this.negativeNumbers, this.largeWeight]),
              reps: new FormControl(warmupSet.reps, [Validators.required, this.negativeNumbers, this.largeReps])
            }));
        }
      }

      // do the same for regular sets
      if (exercise['sets']) {
        for (let set of exercise.sets) {
          setsControlArray.push(
            new FormGroup({
              weight: new FormControl(set.weight, [Validators.required, this.negativeNumbers, this.largeWeight]),
              reps: new FormControl(set.reps, [Validators.required, this.negativeNumbers, this.largeReps])
            }));
        }
      }

      // Finally, grab the exercise name.
      exerciseName = exercise.exerciseName;
    }
    //====== END EDIT MODE =========//

    // Build the actual form to be used.
    this.setsForm = this.formBuilder.group({
      exerciseName: this.formBuilder.control(exerciseName, [Validators.required, this.charLimit50]),
      setType: this.formBuilder.control(setType, null),
      warmupSets: warmupControlArray,
      sets: setsControlArray
    });
  }


  //=================================================================================

  onSubmit() {
    if (this.editMode) { this.workoutService.updateExercise(this.exerciseId, this.setsForm.value) }
    else { this.workoutService.addExercise(this.setsForm.value) }
    this.onNavigateBack();
  }

  onAddSet(event) {
    let controlName = "warmupSets"
    if (event.target.id === "addSetButton") { controlName = "sets" }
    (<FormArray>this.setsForm.get(controlName)).push(
      new FormGroup({
        weight: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeWeight]),
        reps: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeReps])
      })
    )
  }

  // onAddDropSet() {
  //   let setsArray = this.setsForm.controls.sets as FormArray;
  //   let arrayLength = setsArray.length;

  //   let newSetGroup: FormGroup = this.formBuilder.group({
  //     weight: [null, [Validators.required, this.largeWeight]],
  //     reps: [null, [Validators.required, this.negativeNumbers, this.largeReps]]
  //   })

  //   setsArray.insert(arrayLength, newSetGroup)
  // }

  onDeleteSet(index) {
    let setsArray = this.setsForm.controls.sets as FormArray;
    setsArray.removeAt(index);
  }

  onDeleteWarmup(index) {
    let warmupArray = this.setsForm.controls.warmupSets as FormArray;
    warmupArray.removeAt(index);
  }

  onDeleteExercise() {
    this.workoutService.deleteExercise(this.exerciseId)
    this.onNavigateBack();
  }

  onNavigateBack() {
    const date = this.workoutService.getFormattedDate()
    this.router.navigate(['workout/' + date])
  }


  //- VALIDATION STUFF --------------------------------------------------------------------

  get controls() {
    return (<FormArray>this.setsForm.get('sets')).controls;
  }

  // Sets-Form To Validate
  SFTV(index, variable) {
    let formArray = this.setsForm.get('sets') as FormArray;
    let formGroup = formArray.at(index).get(variable);
    return formGroup
  }

  // Warmups-Form To Validate
  WFTV(index, variable) {
    let formArray = this.setsForm.get('warmupSets') as FormArray;
    let formGroup = formArray.at(index).get(variable);
    return formGroup
  }

  charLimit50(control: FormControl): { [s: string]: boolean } {
    if (String(control.value).length > 50) {
      return { 'charLimit50': true }
    }
  }

  charLimit1000(control: FormControl): { [s: string]: boolean } {
    if (String(control.value).length > 1000) {
      return { 'charLimit1000': true }
    }
  }

  negativeNumbers(control: FormControl): { [s: string]: boolean } {
    if (0 >= control.value && control.value != null) {
      return { 'negativeNumbers': true }
    }
  }

  largeWeight(control: FormControl): { [s: string]: boolean } {
    if (1000 <= control.value) {
      return { 'largeNumbers': true }
    }
  }

  largeReps(control: FormControl): { [s: string]: boolean } {
    if (100 <= control.value) {
      return { 'largeNumbers': true }
    }
  }

}
