import { OnInit, ViewChild, Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { WorkoutService } from '../../workout.service';
import { Exercise } from '../../shared/exercise.model';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RepmaxService } from 'src/app/repmax.service';


//========================================================================

@Component({
  selector: 'app-edit-exercise',
  templateUrl: './edit-exercise.component.html',
  styleUrls: ['./edit-exercise.component.css']
})

//..........................................................................

export class EditExerciseComponent implements OnInit {
  
  //#region === Properties ================================================================

  editMode = true; // False when adding new exercise, false when editing existing

  exerciseId: number;
  exercise: Exercise;

  @ViewChild('setType') selectElement;
  setsForm: FormGroup;
  exerciseName: string = '';
  stringSetType: string;

  options: string[] = [];
  filteredOptions: Observable<string[]>;

  //#endregion

  //#region === Lifecycle hooks ==========================================================

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private workoutService: WorkoutService,
    private repMaxService: RepmaxService,
    private formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    public dialog: MatDialog) { }

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

  //#region === Mat-design functions ======================================================

  // A function to make the suggested options for the exercise name input. 
  private setOptions() {
    this.options = this.workoutService.getRecordNames(); // Get all exercises names ever recorded
    this.filteredOptions = this.setsForm.get('exerciseName').valueChanges // Suggest names as user types
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
  }

  // A filter function to be used with setOptions()
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  // It opens a snackbar, ya dingus. (mmmmm...snackbar... *drools*)
  private openSnackBar() {
    this._snackBar.open(
      this.editMode ? 'Exercise successfully edited' : 'Exercise successfully added.', 
      'dismiss', 
      { duration: 5000 }
      )
  }

  // A way to view previous sets/notes for this specific exercise. NOT IMPLEMENTED YET.
  openDialog() {
    const dialogRef  = this.dialog.open(NotesDialog, {
      width: '250px',
      data: this.repMaxService.getPreviousNotes(this.exerciseName)
    });
  }

  //#endregion

  //#region === Button Functions ============================================================

  // Executed when exercise form is submitted.
  onSubmit() {
    console.log("METHOD: onSubmit()")

    if (this.editMode) { this.workoutService.updateExercise(this.exerciseId, this.setsForm.value) }
    else { this.workoutService.addExercise(this.setsForm.value) }
    this.onNavigateBack();
    this.openSnackBar();

    console.log("CLOSED: onSubmit()")
  }

   // Deletes exercise from workout-service, and navigates back.
  onDeleteExercise() {
    this.workoutService.deleteExercise(this.exerciseId)
    this.onNavigateBack();
  }

  // Used by onSubmit() and onDeleteExercise()
  onNavigateBack() {
    const date = this.workoutService.getFormattedDate()
    this.router.navigate(['workout/' + date])
  }

  // Adds a basic set to the form.
  onAddSet() {
    (<FormArray>this.setsForm.get('sets')).push(
      new FormGroup({
        weight: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeWeight]),
        reps: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeReps])
      })
    )
  }

  // Deletes a basic set and accompanying RP or drop-sets.
  onDeleteSet(index) {
    let setsArray = this.setsForm.controls.sets as FormArray;
    setsArray.removeAt(index);
  }

  // Adds a warmup set.
  onAddWarmupSet() {
    let controlName = "warmupSets";
    (<FormArray>this.setsForm.get('warmupSets')).push(
      new FormGroup({
        weight: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeWeight]),
        reps: new FormControl(null, [Validators.required, this.negativeNumbers, this.largeReps])
      })
    )
  }

  // Deletes a warmup set.
  onDeleteWarmup(index) {
    let warmupArray = this.setsForm.controls.warmupSets as FormArray;
    warmupArray.removeAt(index);
  }

  // Adds a RP set to the specified set form.
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

  // Deletes a specific RP set from specific set form
  deleteRestPauseSet(setFormIndex: number, restPauseIndex: number) {
    let restPauseArray = <FormArray> this.getSetFormGroup(setFormIndex).get('restPauseSets');
    restPauseArray.removeAt(restPauseIndex);
  }

  // Adds a drop set to specific set form.
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

  // Deletes specific dropset from specific set form
  deleteDropSet(setFormIndex: number, dropSetIndex: number) {
    let dropSetArray = <FormArray> this.getSetFormGroup(setFormIndex).get('dropSets');
    dropSetArray.removeAt(dropSetIndex);
  }

  //#endregion

  //#region === Form Functions ==============================================================

  // Setup (and populate) the form.
  private initForm() {

    // Initialize values of the form fields...
    // (except exerciseName and stringSetType, which are properties of the component)
    let exerciseNotes = null;
    let warmupControlArray = new FormArray([]);
    let setsControlArray = new FormArray([]);

    // Edit mode is when you are editing EXISTING an exercise. Determined in OnInit.
    if (this.editMode) { //=================== EDIT MODE ================///
      console.log('edit mode')

      // From the target exercise object...
      this.exercise = this.workoutService.getExercise(this.exerciseId);

      // ...get the exercise name, setType, and notes
      this.exerciseName = this.exercise.exerciseName;
      this.stringSetType = this.exercise.setType;
      exerciseNotes = this.exercise.exerciseNotes;

      // From that, define a formgroup to be used with each warmup set
      if (this.exercise['warmupSets']) {
        for (let warmupSet of this.exercise.warmupSets) {
          warmupControlArray.push(
            new FormGroup({
              weight: new FormControl(warmupSet.weight, [Validators.required, this.negativeNumbers, this.largeWeight]),
              reps: new FormControl(warmupSet.reps, [Validators.required, this.negativeNumbers, this.largeReps])
            }));
        }
      }

      // Do the same for regular sets
      if (this.exercise['sets']) {
        for (let set of this.exercise.sets) {

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

          // And drop sets...
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
      exerciseName: this.formBuilder.control(this.exerciseName, [Validators.required, this.charLimit50]),
      setType: this.formBuilder.control(this.stringSetType, null),
      exerciseNotes: this.formBuilder.control(exerciseNotes, null),
      warmupSets: warmupControlArray,
      sets: setsControlArray
    });
  }

  // Checks the 'setType' property to determine if it is a type of rest-pause set.
  isRestPauseSet(): boolean {
    if (this.stringSetType === 'myo' || this.stringSetType === 'rpd') { return true; }
    return false;
  }

  // Return the top-level control for 'sets'.
  getSetControls() {
    return (<FormArray> this.setsForm.controls.sets).controls
  }

  // Get top-level control for 'warmupSets'
  getWarmupSetControls() {
    return (<FormArray> this.setsForm.controls.warmupSets).controls
  }
  
  // Get the form-group of a specified set
  getSetFormGroup(index: number): FormGroup {
    return <FormGroup> (<FormArray> this.setsForm.get('sets')).at(index)
  }

  // Get the FORM-ARRAY of specified RP set. If none exists, create one (important).
  getRestPauseFormArray(index: number): FormArray {
    let restPauseFormArray = <FormArray> this.getSetFormGroup(index).get('restPauseSets');
    if (!restPauseFormArray) {
      return new FormArray([])
    }
    return restPauseFormArray;
  }

  //#endregion

  // #region === VALIDATION STUFF ===========================================================

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
  //#endregion

}

//#region === Dialog Box =====================================================================

export interface DialogData {
  date: string,
  notes: string
}

//========================================================================

@Component({
  selector: 'notes-dialog',
  templateUrl: './notes-dialog.component.html'
})
export class NotesDialog {

  constructor(
    public dialogRef: MatDialogRef<NotesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData[]
  ) {}
}

//#endregion

