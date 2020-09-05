import { OnInit, ViewChild, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl, FormGroupDirective, NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkoutService } from '../../workout.service';
import { Exercise } from '../../shared/exercise.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

//========================================================================

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.component.html',
  styleUrls: ['./edit-exercise.component.css']
})

//............................................................................

export class EditExerciseComponent implements OnInit {
  //#region fields
  @ViewChild('setType') selectElement;
  public setsForm: FormGroup;
  exerciseId: number;
  editMode = true; // False when adding new exercise, false when editing existing
  stringSetType: string;

  myControl = new FormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;
  //#endregion

  //#region lifecycle hooks

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(
      (params: Params) => {
        this.exerciseId = +params['exerciseId'];
        this.editMode = params['exerciseId'] != null;
      }
    );
    this.initForm();
    this.setOptions();
  }
  //#endregion

  private initForm() {

    // Initial values of the form fields
    let exerciseName = '';
    this.stringSetType = '';
    let exerciseNotes = '';
    let warmupControlArray = new FormArray([]);
    let setsControlArray = new FormArray([]);

    if (this.editMode) { //=================== EDIT MODE ================///
      console.log('edit mode')

      // From the target exercise object...
      const exercise: Exercise = this.workoutService.getExercise(this.exerciseId);

      // ...get the exercise name, setType, and notes
      exerciseName = exercise.exerciseName;
      this.stringSetType = exercise.setType;
      exerciseNotes = exercise.exerciseNotes;

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

      // Do the same for regular sets
      if (exercise['sets']) {
        for (let set of exercise.sets) {

          let formGroup = new FormGroup({
            weight: new FormControl(set.weight, [Validators.required, this.negativeNumbers, this.largeWeight]),
            reps: new FormControl(set.reps, [Validators.required, this.negativeNumbers, this.largeReps]),
            restPauseSets: new FormArray([]),
            dropSets: new FormArray([])
          })
          setsControlArray.push(formGroup);

          // Now check for rest-pause sets...
          if (set.restPauseSets) {
            for (let restPauseSet of set.restPauseSets) {
              (<FormArray>formGroup.get('restPauseSets')).push
                (new FormControl(
                  restPauseSet, [Validators.required, this.negativeNumbers, this.largeWeight]));
            }
          }

          if (set.dropSets) {
            for (let dropSet of set.dropSets) {
              (<FormArray>formGroup.get('dropSets')).push
                (new FormGroup({
                  weight: new FormControl(dropSet.weight, [Validators.required, this.negativeNumbers, this.largeWeight]),
                  reps: new FormControl(dropSet.reps, [Validators.required, this.negativeNumbers, this.largeReps])
                }))
            }
          }

        }
      }
      //====== END EDIT MODE ===================//
    }  

    // Build the actual form to be used.
    this.setsForm = this.formBuilder.group({
      exerciseName: this.formBuilder.control(exerciseName, [Validators.required, this.charLimit50]),
      setType: this.formBuilder.control(this.stringSetType, null),
      exerciseNotes: this.formBuilder.control(exerciseNotes, null),
      warmupSets: warmupControlArray,
      sets: setsControlArray
    });
  }

  // #region set functions

  private setOptions() {
    this.options = this.workoutService.getRecordNames();
    this.filteredOptions = this.setsForm.get('exerciseName').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  private openSnackBar() {
    this._snackBar.open(
      this.editMode ? 'Exercise successfully edited' : 'Exercise successfully added.', 
      'dismiss', 
      { duration: 5000 }
      )
  }

  addRestPauseSet(index: number) {
    let targetFormGroup = this.getSetFormGroup(index)
    if (!targetFormGroup.get('restPauseSets')) {
      targetFormGroup.addControl(
        'restPauseSets', new FormArray([])
      )
    }
    (<FormArray>targetFormGroup.get('restPauseSets')).push(
      new FormControl(null, [Validators.required, this.negativeNumbers, this.largeReps]),
    )
  }

  addDropSet(index: number) {
    let targetFormGroup = this.getSetFormGroup(index)
    if (!targetFormGroup.get('dropSets')) {
      targetFormGroup.addControl(
        'dropSets', new FormArray([])
      )
    }
    (<FormArray>targetFormGroup.get('dropSets')).push(
      new FormGroup({
        weight: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeWeight]),
        reps: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeReps])
      })
    )
  }


  deleteRestPauseSet(setFormIndex: number, restPauseIndex: number) {
    let restPauseArray = <FormArray> this.getSetFormGroup(setFormIndex).get('restPauseSets');
    restPauseArray.removeAt(restPauseIndex);
  }

  deleteDropSet(setFormIndex: number, dropSetIndex: number) {
    let dropSetArray = <FormArray>this.getSetFormGroup(setFormIndex).get('dropSets');
    dropSetArray.removeAt(dropSetIndex);
  }


  onSubmit() {
    console.log("METHOD: onSubmit()")

    if (this.editMode) { this.workoutService.updateExercise(this.exerciseId, this.setsForm.value) }
    else { this.workoutService.addExercise(this.setsForm.value) }
    this.onNavigateBack();
    this.openSnackBar();

    console.log("CLOSED: onSubmit()")
  }

  onNavigateBack() {
    const date = this.workoutService.getFormattedDate()
    this.router.navigate(['workout/' + date])
  }


  onAddSet() {
    (<FormArray>this.setsForm.get('sets')).push(
      new FormGroup({
        weight: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeWeight]),
        reps: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeReps])
      })
    )
  }

  onAddWarmupSet() {
    let controlName = "warmupSets";
    (<FormArray>this.setsForm.get('warmupSets')).push(
      new FormGroup({
        weight: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeWeight]),
        reps: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeReps])
      })
    )
  }

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

  isRestPauseSet() {
    if (this.stringSetType === 'myo' || this.stringSetType === 'rpd') { return true; }
    return false;
  }
  //#endregion 

  // #region GETTERS AND SETTERS -----------------------------------------------------------------//
  
  getSetFormGroup(index: number): FormGroup {
    return <FormGroup>(<FormArray>this.setsForm.get('sets')).at(index)
  }

  getRestPauseFormArray(index: number): FormArray {
    let restPauseFormArray = <FormArray>this.getSetFormGroup(index).get('restPauseSets');
    if (!restPauseFormArray) {
      return new FormArray([])
    }
    return restPauseFormArray;
  }

  getDropSetFormArray(index: number): FormArray {
    return <FormArray>this.getSetFormGroup(index).get('dropSets')
  }

  getDropSetControl(dropSetFormGroup: AbstractControl, controlName: string) {
    return (<FormGroup> dropSetFormGroup).get(controlName)
  }
  //#endregion

  // #region VALIDATION STUFF --------------------------------------------------------------------

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

  getSetControls() {
    return (<FormArray> this.setsForm.controls.sets).controls
  }

  getWarmupSetControls() {
    return (<FormArray> this.setsForm.controls.warmupSets).controls
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
  //#endregion
}


