import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

//========================================================================

@Component({
	selector: 'app-edit-routine',
	templateUrl: './edit-routine.compononent.html',
	// styleUrls: ['./edit-routine.component.css]
})

//..........................................................................

export class EditRoutineComponent implements OnInit {

	//#region === Properties ================================================================



	//#endregion

	//#region === Lifecycle hooks ==========================================================

	constructor() { }

	ngOnInit() {

	}

	//#endregion

	//#region === Form Functions ==========================================================

	onAddExercise() { }

	onDeleteRoutine() { }

	//#endregion

	//#region === Mat-design Functions ==========================================================

	step = 0;

	setStep(index: number) { this.step = index; }

	nextStep() { this.step++; }

	prevStep() { this.step--; }

	//#endregion

	//#region === Other Functions ==========================================================

	onNavigateBack() { }

	//#endregion


}
