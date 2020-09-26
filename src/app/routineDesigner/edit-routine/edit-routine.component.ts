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

	editMode = true;
	routineForm: FormGroup;

	routineName: string;
	routineNotes: string;
	numCycles: number;

	//#endregion

	//#region === Lifecycle hooks ==========================================================

	constructor(private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.initForm();
	}

	//#endregion

	//#region === Form Functions ==========================================================

	private initForm() {

		let routineNotes = null;
		let daysControlArray = new FormArray([])

		this.routineForm = this.formBuilder.group({
			name: this.formBuilder.control(this.routineName, []),
			notes: this.formBuilder.control(this.routineNotes, []),
			numCycles: this.formBuilder.control(this.numCycles, []),
			days: daysControlArray
		})
	}

	onAddDay() { }

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
