import { Injectable } from '@angular/core';
import { Workout } from './shared/workout.model';
import { Exercise } from './shared/exercise.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RepmaxService {

  constructor(private http: HttpClient) { }

  // ===============================================

  calculateMax(reps: number, weight: number) {
    let unrounded = weight * (1 + (reps/30));
    return +unrounded.toFixed(2)
  }

  storeAllMaxes(workout: Workout) {

    workout.exercises.forEach(exercise => {

      if (exercise.sets.length < 1) { return; } // This is essentially 'continue'... to skip iterations with no sets.
      
      let maxArray = [];
      exercise.sets.forEach(set => {
        maxArray.push(this.calculateMax(set.reps, set.weight));
      })

      let calculatedMax = Math.max(...maxArray)
      let entry = {
        date: workout.date,
        ORM: calculatedMax
      }

      const url = 'https://strengthpractice-7e443.firebaseio.com/repmax/' 
      + exercise.exerciseName.toLowerCase() + '/' + entry.date + '.json'
      this.http.patch(url, entry).subscribe(response => { console.log(response) })
      }
    )
  }

}
