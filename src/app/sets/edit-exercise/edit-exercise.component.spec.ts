import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { EditExerciseComponent } from "./edit-exercise.component";
import { FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";
import { MatSnackBar } from "@angular/material/snack-bar";
import { OverlayModule } from "@angular/cdk/overlay";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { MatAutocompleteModule } from "@angular/material/autocomplete";

describe("EditExerciseComponent", () => {
  let home: EditExerciseComponent;
  let fixture: ComponentFixture<EditExerciseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditExerciseComponent],
      imports: [
        RouterTestingModule,
        HttpClientModule,
        OverlayModule,
        MatDialogModule,
        MatAutocompleteModule,
      ],
      providers: [FormBuilder, MatSnackBar, MatDialog],
    }).compileComponents();
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(EditExerciseComponent);
      home = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it("should be created", async(() => {
    expect(home).toBeTruthy();
  }));
});
