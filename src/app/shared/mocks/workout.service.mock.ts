import { BehaviorSubject, Observable } from 'rxjs';
import { Exercise } from '../exercise.model';
import { Workout } from '../workout.model';

export class WorkoutServiceStub {

  exerciseUpdated = new BehaviorSubject<Exercise[]>(null);
  bodyweightUpdated = new BehaviorSubject<number>(null);

  workout: Workout;
  date: string;


	fetchWorkout(dateString?: string) {
		this.workout = {
			dateString: new Date(2020, 11, 5).toLocaleDateString(),
			category: '',
			bodyweight: 170,
			exercises: [
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
			],
			notes: ''
		}
		this.exerciseUpdated.next(this.workout.exercises);
		this.bodyweightUpdated.next(this.workout.bodyweight);
	};

  storeWorkout() {
    return Observable.create(observer => {
      setTimeout(() => {
        if (this.workout) {
          observer.next(this.workout);
        } else {
          observer.error('An error occurred');
        }
      }, 1000);
    });
  }


}
