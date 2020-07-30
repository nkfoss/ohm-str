import { Injectable, OnInit } from '@angular/core';
import { Workout } from './shared/workout.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { WorkoutService } from './workout.service';
import { Exercise } from './shared/exercise.model';
import { RepMaxRecord } from './shared/repMaxRecord.model';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class RepmaxService {

  recordMaxes: JSON;
  asd: JSON;
  todaysMaxes: RepMaxRecord[] = [];
  recordMaxUpdated = new Subject<JSON>();
  todaysMaxesUpdated = new Subject<RepMaxRecord[]>();

  // ================================================

  constructor(private http: HttpClient,
    private workoutService: WorkoutService) { }

  // ===============================================

  calculateMax(reps: number, weight: number) {
    let unrounded = weight * (1 + (reps / 30));
    return +unrounded.toFixed(2)
  }

  storeAllMaxes(workout: Workout) {

    workout.exercises.forEach(exercise => {

      if (exercise.sets.length < 1 || exercise.setType === "clusters") { return; } // This is essentially 'continue'... to skip iterations with no sets.

      let maxArray = [];
      exercise.sets.forEach(set => {
        maxArray.push(this.calculateMax(set.reps, set.weight));
      })

      let calculatedMax = Math.max(...maxArray)
      let entry = {
        date: workout.date,
        ORM: calculatedMax
      }

      const url = 'https://strengthpractice-7e443.firebaseio.com/daymaxes/'
        + exercise.exerciseName.toLowerCase() + '/' + entry.date + '.json'
      this.http.patch(url, entry).subscribe(response => { console.log(response) })
    })
  }

  fetchRecords() {
    let url = 'https://strengthpractice-7e443.firebaseio.com/recordmaxes.json';
    this.http.get(url).subscribe(response => {
      this.recordMaxes = <JSON> response;
    });
    this.recordMaxUpdated.next( this.recordMaxes )

    let dayMaxUrl = 'https://strengthpractice-7e443.firebaseio.com/daymaxes.json'
    this.http.get(dayMaxUrl).subscribe(response => {
      this.asd = <JSON> response;
    });
  }

  setTodaysRecords(exercises: Exercise[]) {
    exercises.forEach(exercise => {
      let record = new RepMaxRecord( 
        exercise.exerciseName, this.getRepMaxFromName(this.recordMaxes, exercise.exerciseName) 
        );
      this.todaysMaxes.push(record)
    });
    this.todaysMaxesUpdated.next(this.todaysMaxes)
  }

  asdMethod() {
    for (var exerciseName in this.recordMaxes) {
      for (var key in this.asd) {
        if (this.asd.hasOwnProperty(key)) {
          if (key == exerciseName) {
            let liftObj = this.asd[key];
            for (var date in liftObj) {
              let dayMax = liftObj[date]['ORM'];
              if (dayMax > this.recordMaxes[exerciseName]) {
                console.log('bigger! ' + dayMax + ' ' + this.recordMaxes[exerciseName] + ' ' + exerciseName)
                this.recordMaxes[exerciseName] = dayMax
              }
            }
          }
        }
      }
    }
    const url = 'https://strengthpractice-7e443.firebaseio.com/recordmaxes.json'
      this.http.patch(url, this.recordMaxes).subscribe(response => { console.log(response) })

  }

  
  getRepMaxFromName(obj, name) {
    for (var key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (key == name) {
          return(obj[key])
        } 
      }
    }
  }

}
