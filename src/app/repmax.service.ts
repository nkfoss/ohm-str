import { Injectable, OnInit } from '@angular/core';
import { Workout } from './shared/workout.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Exercise } from './shared/exercise.model';
import { RepMaxRecord } from './shared/repMaxRecord.model';

@Injectable({
  providedIn: 'root'
})
export class RepmaxService {

  recordMaxes: JSON;
  dayMaxes: JSON;
  todaysMaxes: RepMaxRecord[] = [];
  recordMaxUpdated = new Subject<JSON>();
  todaysMaxesUpdated = new Subject<RepMaxRecord[]>();

  // ================================================

  constructor(private http: HttpClient) { }

  // ===============================================

  // Calculate the 1rm from reos/weight. 
  // [this: storeAllMaxes, setPercentEffort, calculateBestMax]
  calculateMax(reps: number, weight: number) {
    let unrounded = weight * (1 + (reps / 30));
    return +unrounded.toFixed(2)
  }

  // Takes an exercise, and calculates the 1rm of the best set (if any).
  // [this.setPercentEffort]
  calculateBestMax(exercise: Exercise) {
    if (exercise.sets) {
      let maxArray: number[] = []
      exercise.sets.forEach(set => {
        maxArray.push(this.calculateMax(set.reps, set.weight))
      })
      return Math.max(...maxArray)
    }
  }

  // Look-up all-time record by name of exercise
  getRecordMaxFromName(exerciseName: string) {
    console.log('search for ' + exerciseName + ' in records...')
    let records = this.recordMaxes
    for (var key in records) {
      if (records.hasOwnProperty(key)) {
        if (key == exerciseName) {
          return (records[key])
        }
      }
    }
  }


  ///================================================================================///

  // Calculate/store all the day maxes.
  patchDayMaxes(workout: Workout) {
    workout.exercises.forEach(exercise => {

      if (exercise.sets.length < 1 || exercise.setType === "clusters") { return; }
      // This is essentially 'continue'... to skip iterations with no sets.

      // Find the highest 1rm from the sets, and create a record entry
      let calculatedMax = this.calculateBestMax(exercise)
      let entry = {
        date: workout.date,
        ORM: calculatedMax
      }
      // Send the entry to the database. Print the response.
      const url = 'https://strengthpractice-7e443.firebaseio.com/daymaxes/'
        + exercise.exerciseName.toLowerCase() + '/' + entry.date + '.json'

      this.http.patch(url, entry).subscribe(response => { console.log(response) })
    })
  }


  // This fetches day-records AND all-time records. [SetListComponent: ngOnInit]
  // If they've already been fetched, then do nothing.
  fetchRecords() {
    if (!this.recordMaxes) {
      let recordMaxUrl = 'https://strengthpractice-7e443.firebaseio.com/recordmaxes.json';
      this.http.get(recordMaxUrl).subscribe(response => {
        console.log("Fetching record maxes...");
        console.log(response);
        this.recordMaxes = <JSON>response;
      });
      this.recordMaxUpdated.next(this.recordMaxes)

      let dayMaxUrl = 'https://strengthpractice-7e443.firebaseio.com/daymaxes.json'
      this.http.get(dayMaxUrl).subscribe(response => {
        console.log("Fetching day maxes...");
        console.log(response);
        this.dayMaxes = <JSON>response;
      });
    }

  }

  getRecordNames(): string[] {
    let nameArr: string[] = [];
    for (var exerciseName in this.recordMaxes) {
      nameArr.push(exerciseName);
    }
    return nameArr;
  }

  // Takes an exercise and record max...then calculates/sets percent effort based on a recordMax
  setPercentEffort(exercise: Exercise, recordMax: number) {

    // If null, calculate it and set it. Print alert statement.
    // if (!recordMax) {
    //   console.log('setPercentEffort() received a null recordMax!')
    //   this.recordMaxes[exercise.exerciseName] = this.calculateBestMax(exercise)
    // }

    // For each set (if any), set the percent effort
    if (exercise.sets) {
      exercise.sets.forEach(set => {
        let setMax = this.calculateMax(set.reps, set.weight);
        set.percentEffort = Number((setMax / recordMax).toFixed(2));
      })
    }
  }

  patchRecordMaxes(recordMaxes: JSON) {
    const url = 'https://strengthpractice-7e443.firebaseio.com/recordmaxes.json';
    this.http.patch(url, this.recordMaxes).subscribe( response => {console.log(response)} )
  }

  // asdMethod() {
  //   for (var exerciseName in this.recordMaxes) {
  //     for (var key in this.asd) {
  //       if (this.asd.hasOwnProperty(key)) {
  //         if (key == exerciseName) {
  //           let liftObj = this.asd[key];
  //           for (var date in liftObj) {
  //             let dayMax = liftObj[date]['ORM'];
  //             if (dayMax > this.recordMaxes[exerciseName]) {
  //               console.log('bigger! ' + dayMax + ' ' + this.recordMaxes[exerciseName] + ' ' + exerciseName)
  //               this.recordMaxes[exerciseName] = dayMax
  //             }
  //           }
  //         }
  //       }
  //     }
  //   }
  //   const url = 'https://strengthpractice-7e443.firebaseio.com/recordmaxes.json'
  //   this.http.patch(url, this.recordMaxes).subscribe(response => { console.log(response) })

}









