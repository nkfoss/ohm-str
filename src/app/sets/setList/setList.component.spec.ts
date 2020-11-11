import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { By } from "@angular/platform-browser";
import { DebugElement } from "@angular/core";

import { SetListComponent } from "./setList.component";
import { WorkoutService } from "../../workout.service";
import { RepmaxService } from "src/app/repmax.service";
import { RouterTestingModule } from "@angular/router/testing";
import { MatSnackBarModule } from "@angular/material/snack-bar";

describe("setList", () => {
  let setList: SetListComponent;
  let fixture: ComponentFixture<SetListComponent>;

  let workoutServiceStub: {};
  let repmaxServiceStub: {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule
      ],
      declarations: [SetListComponent],
      providers: [
        { provide: WorkoutService, useValue: workoutServiceStub },
        { provide: RepmaxService, useValue: repmaxServiceStub },
      ],
    });
  });

  it('should create the SetList Component', () => {
    let fixture = TestBed.createComponent(SetListComponent);
    let SLC = fixture.debugElement.componentInstance;
    expect(SLC).toBeTruthy();
  })

});

// activated route: {"_isScalar":false,"observers":[],"closed":false,"isStopped":false,"hasError":false,"thrownError":null,"_value":[{"path":"workout","parameters":{}},{"path":"Sep 04 2020","parameters":{}}]}
// URL: workout,Sep%2004%20202
