import { Injectable } from '@angular/core';
import { Exercise } from './shared/exercise.model';
import { Workout } from './shared/workout.model'
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WorkoutService {
  
  private workout: Workout = {
    date: new Date(),
    category: "category placeholder",
    notes: "notes placeholder......",
    exercises: [
      { exerciseName: "Bench Press",
        sets: [
          { weight: 45, reps: 12 },
          { weight: 95, reps: 10 },
          { weight: 135, reps: 5 },
          { weight: 155, reps: 7 } 
        ] 
      },
        { exerciseName: "Side Lateral Raise",
        sets: [
          { weight: 15, reps: 10 },
          { weight: 15, reps: 10 },
          { weight: 17.5, reps: 8 }
        ]
      },
      { exerciseName: "Tricep Pressdown",
        sets: [
          { weight: 42.5, reps: 10 },
          { weight: 50, reps: 10 },
          { weight: 60, reps: 10 },
          { weight: 60, reps: 1 }
        ]
      },
      { exerciseName: "Leg Press",
        sets: [
          { weight: 180, reps: 8 },
          { weight: 215, reps: 11 },
          { weight: 240, reps: 8 },
          { weight: 270, reps: 10 },
          { weight: 270, reps: 3 },
          { weight: 270, reps: 3 },
          { weight: 270, reps: 3 },
        ]
      },
      { exerciseName: "Cable Crunches",
        sets: [
          { weight: 90, reps: 10 },
          { weight: 110, reps: 9 },
          { weight: 100, reps: 2 },
        ]
      },
    ]

  }

  exerciseUpdated = new Subject<Exercise[]>();

  //=============================================

  getWorkout () {return this.workout; }

  getExercises() { return this.workout.exercises.slice(); }
  
  getExercise(exerciseIndex): Exercise { return { ...this.workout.exercises[exerciseIndex] }; }

  getFormattedDate() { return this.workout.date.toDateString() }

  addExercise(newExercise) {
    console.log("New exercise: ", newExercise)
    this.workout.exercises.push(newExercise);
    this.exerciseUpdated.next( this.getExercises() )
    console.log(this.workout)
  }

  updateExercise(exerciseIndex, newExercise) {
    this.workout.exercises[exerciseIndex] = newExercise;
    this.exerciseUpdated.next( this.getExercises() )
  }

  deleteSet(exerciseIndex, setIndex) {
     this.workout.exercises[exerciseIndex].sets.splice(setIndex, 1)
     this.exerciseUpdated.next( this.getExercises() )
  }

  deleteExercise(exerciseIndex) {
    this.workout.exercises.splice(exerciseIndex, 1);
    this.exerciseUpdated.next( this.getExercises() )
  }

}
