import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { SetListComponent } from './setList.component';
import { WorkoutService } from '../../workout.service';
import { RepmaxService } from 'src/app/repmax.service';
import { RouterTestingModule } from '@angular/router/testing';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { WorkoutServiceStub } from 'src/app/shared/mocks/workout.service.mock';
import { RepmaxServiceStub } from 'src/app/shared/mocks/repmax.service.mock';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('setList', () => {
  let setList: SetListComponent;
  let fixture: ComponentFixture<SetListComponent>;
  let router: Router;
  let route: ActivatedRoute;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule
      ],
      declarations: [SetListComponent],
      providers: [
        { provide: WorkoutService, useClass: WorkoutServiceStub },
        { provide: RepmaxService, useClass: RepmaxServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: { date: 'Nov 05 2020' }
            },
            params: of({ date: 'Nov 05 2020' })
          }
        }
      ]
    });

    router = TestBed.inject(Router);
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(SetListComponent);
    setList = fixture.debugElement.componentInstance;

    fixture.detectChanges();
  }));

  it('should create the SetList Component', () => {
    expect(setList).toBeTruthy();
  });

  it('should setup the exercise and bodyweight subs', () => {
    expect(setList.bodyweightSub).toBeDefined();
    expect(setList.exerciseSub).toBeDefined();
  });

  it('should indicate if a workout was not found', () => {
    const consoleSpy = spyOn(console, 'log');
    const workoutService = fixture.debugElement.injector.get(WorkoutService);

    workoutService.workout = null;
    setList.ngOnInit();
    expect(consoleSpy).toHaveBeenCalledWith('No workout found');
  });

  it('should indicate if component\'s data does not match service\'s workout date', () => {
    const consoleSpy = spyOn(console, 'log');
    const workoutService = fixture.debugElement.injector.get(WorkoutService);

    workoutService.workout.dateString = 'Nov 20 2020';
    setList.ngOnInit();
    expect(consoleSpy).toHaveBeenCalledWith('Dates don\'t match');
  });

  it('should have the exercise array and bodyweight updated', () => {
    expect(setList.exercises).toEqual([
      {
        exerciseName: 'Bench Press',
        setType: 'rpd',
        exerciseNotes: 'bench press notes',
        momentaryMax: 200,
        warmupSets: [],
        sets: [{ weight: 200, reps: 1 }]
      },
      {
        exerciseName: 'Squat',
        setType: 'mtor',
        exerciseNotes: 'squat notes',
        momentaryMax: 275,
        warmupSets: [],
        sets: [{ weight: 275, reps: 1 }]
      },
      {
        exerciseName: 'Deadlift',
        setType: 'clusters',
        exerciseNotes: 'deadlift notes',
        momentaryMax: 300,
        warmupSets: [],
        sets: [{ weight: 300, reps: 1 }]
      },
    ]);
    expect(setList.bodyweight).toEqual(170);
  });

  it('should have the date property match the service\'s workout date', () => {
    const workoutService = fixture.debugElement.injector.get(WorkoutService);
    expect(setList.dateString).toEqual(workoutService.workout.dateString);
  });

  it('should have the RepMaxService fetch records', () => {
    const repMaxService = fixture.debugElement.injector.get(RepmaxService);
    const serviceSpy = spyOn(repMaxService, 'fetchRecords');

    repMaxService.recordMaxes = null;
    setList.ngOnInit();
    expect(serviceSpy).toHaveBeenCalled();
  });

  it('should have the service call getRecordMaxFromName a certain number of times', () => {
    const repMaxService = fixture.debugElement.injector.get(RepmaxService);
    const serviceSpy = spyOn(repMaxService, 'getRecordMaxFromName');

    setList.ngOnInit();
    expect(serviceSpy).toHaveBeenCalledTimes(setList.exercises.length);
  });

  it('should navigate to exercise/new when calling onNewExercise()', () => {
    // tslint:disable-next-line:no-shadowed-variable
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    setList.onNewExercise();
    expect(navigateSpy).toHaveBeenCalledWith(['exercise/new']);
  });

  it('should navigate to exercise/x/edit when calling onNewExercise()', () => {
    // tslint:disable-next-line:no-shadowed-variable
    const router = TestBed.inject(Router);
    const navigateSpy = spyOn(router, 'navigate');
    setList.onEditExercise(2);
    expect(navigateSpy).toHaveBeenCalledWith(['exercise/2/edit']);
  });

});

describe('setList: onSaveWorkout()', () => {
  let setList: SetListComponent;
  let fixture: ComponentFixture<SetListComponent>;
  let workoutService: WorkoutService;
  let repmaxService: RepmaxService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        MatSnackBarModule
      ],
      declarations: [SetListComponent],
      providers: [
        { provide: WorkoutService, useClass: WorkoutServiceStub },
        { provide: RepmaxService, useClass: RepmaxServiceStub }
      ]
    });

    fixture = TestBed.createComponent(SetListComponent);
    setList = fixture.debugElement.componentInstance;
    workoutService = fixture.debugElement.injector.get(WorkoutService);
    repmaxService = fixture.debugElement.injector.get(RepmaxService);

    fixture.detectChanges();
  }));

  it('should set the workoutservice\'s bodyweight property', () =>  {
    setList.bodyweight = 170;
    setList.onSaveWorkout();
    expect(workoutService.workout.bodyweight).toEqual(170);
  });

  it('should have the repMax service call patchDayMaxes', () => {
    const spy = spyOn(repmaxService, 'patchDayMaxes');
    setList.onSaveWorkout();
    expect(spy).toHaveBeenCalledWith(workoutService.workout);
  });

  it('should have the repMax service call patchRecordMaxes', () => {
    const spy = spyOn(repmaxService, 'patchRecordMaxes');
    setList.onSaveWorkout();
    expect(spy).toHaveBeenCalledWith(repmaxService.recordMaxes);
  });

});
