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
    return weight * (1 + (reps/30));
  }

  storeAllMaxes(workout: Workout) {

    workout.exercises.forEach(exercise => {

      let maxArray = [];
      exercise.sets.forEach(set => {
        maxArray.push(this.calculateMax(set.reps, set.weight));
      })

      let calculatedMax = Math.max(...maxArray)
      let entry = {
        date: workout.date,
        ORM: calculatedMax
      }

      const url = 'https://strengthpractice-7e443.firebaseio.com/repmax/' + exercise.exerciseName + '.json'
      this.http.patch(url, entry).subscribe(response => { console.log(response) })
      }
    )
  }

}
