import { Injectable } from '@angular/core';
import { Workout } from './shared/workout.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Exercise } from './shared/exercise.model';
import { RepMaxRecord } from './shared/repMaxRecord.model';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RepmaxService {

  //#region === Properties ====================================================================

  recordMaxes: JSON;
  updatedRecordMaxes = new Object();
  dayMaxes: JSON;
  todaysMaxes: RepMaxRecord[] = [];
  todaysMaxesUpdated = new Subject<RepMaxRecord[]>();

  //#endregion

  //#region === Lifecycle Hooks ===============================================================

  constructor(private http: HttpClient) { }

  //#endregion

  //#region === Database Functions ============================================================

  //----------------------------------------------------------------------------------------------------

  // This fetches day-records AND all-time records. [SetListComponent: ngOnInit]
  // If they've already been fetched, then do nothing.
  fetchRecords() {
    console.log("METHOD: fetchRecords()")
    this.fetchDayMaxes();
    this.fetchRecordMaxes();
  }

  // Fetch AND set dayMaxes
  private fetchDayMaxes() {
    let dayMaxUrl = 'https://strengthpractice-7e443.firebaseio.com/daymaxes.json'
    this.http.get(dayMaxUrl).subscribe(response => {
      console.log("Fetching day maxes...");
      console.log(response);
      this.dayMaxes = <JSON>response;
    });
  }

  // Fetch AND set recordMaxes
  private fetchRecordMaxes() {
    let recordMaxUrl = 'https://strengthpractice-7e443.firebaseio.com/recordmaxes.json';
    this.http.get(recordMaxUrl).subscribe(response => {
      console.log("Fetching record maxes...");
      console.log(response);
      this.recordMaxes = <JSON>response;
      console.log("CLOSED: fetchRecords()")
    })
  }

  //------------------------------------------------------------------------------------------------

  // Update (patch) record-maxes in the database
  patchRecordMaxes(recordMaxes: JSON) {
    console.log('METHOD: patchRecordMaxes()');

    const url = 'https://strengthpractice-7e443.firebaseio.com/recordmaxes.json';
    this.http.patch(url, this.recordMaxes).subscribe(
      response => {
        console.log("repsonse for patchRecordMaxes:")
        console.log(response);
      }
    )

    console.log("CLOSED: patchRecordMaxes()")
  }

  // Calculate/store all the day maxes.
  patchDayMaxes(workout: Workout) {
    workout.exercises.forEach(exercise => {

      let entry;

      // We store exercises without sets, but we don't deal with them here.
      // This line skips to the next 'forEach' iteration.
      if (exercise.sets.length < 1) { return; }

      // For clusters/mtor, we only want to record the notes, since ORM does not apply.
      else if (exercise.setType === "clusters" || exercise.setType === "mtor") {
        entry = {
          date: workout.date,
          notes: exercise.exerciseNotes
        }
      }

      // For all other sets, record notes and calculate ORM.
      else {
        let calculatedMax = this.calculateBestMax(exercise);

        // We need to update record max if it was broken.
        this.compareMaxes(exercise.exerciseName, calculatedMax)

        // Now construct the entry for the dayMax
        entry = {
          date: workout.date,
          ORM: calculatedMax,
          notes: exercise.exerciseNotes
        }
      }

      // Send the entry to the database. Print the response.
      const url = 'https://strengthpractice-7e443.firebaseio.com/daymaxes/'
        + exercise.exerciseName.toLowerCase() + '/' + entry.date + '.json'

      this.http.patch(url, entry).subscribe(
        response => { console.log(response) },
        error => { console.log(error) }
      )
    })
  }

  private compareMaxes(exerciseName: string, calculatedMax: number) {
    let records = this.recordMaxes
    for (var key in records) {
      if (records.hasOwnProperty(key)) {
        if (key == exerciseName) {

          let currentMax = (records[key])
          if (calculatedMax > currentMax) { records[key] = calculatedMax }  // Update recordMax

        }
      }
    }
  }



  //#endregion

  //#region === Other functions ===============================================================

  // Calculate the 1rm from reps/weight. 
  // [this: storeAllMaxes, setPercentEffort, calculateBestMax]
  calculateMax(reps: number, weight: number) {
    let unrounded = weight * (1 + (reps / 30));
    return +unrounded.toFixed(2)
  }

  // Takes an exercise, and calculates the 1rm of the best set (if any).
  // [this.setPercentEffort]
  calculateBestMax(exercise: Exercise) {
    console.log("METHOD: calculateBestMax()")

    if (exercise.sets) {
      let maxArray: number[] = []
      exercise.sets.forEach(set => {
        maxArray.push(this.calculateMax(set.reps, set.weight))
      })

      console.log("CLOSED: calculateBestMax() with RETURN " + Math.max(...maxArray))
      return Math.max(...maxArray)
    }

    console.log("CLOSED: calculateBestMax() with NO RETURN")

  }

  // Look-up all-time record by name of exercise
  getRecordMaxFromName(exerciseName: string): number {
    console.log("METHOD: getRecordMaxFromName()")

    console.log('search for ' + exerciseName + ' in records...')
    let records = this.recordMaxes
    for (var key in records) {
      if (records.hasOwnProperty(key)) {
        if (key == exerciseName) {
          console.log("CLOSED: getRecordMaxFromName() with RETURN: " + records[key])
          return (records[key])
        }
      }
    }

    console.log("CLOSED: getRecordMaxFromName() with NO RETURN")
  }

  // From an exercise name, lookup and return an object with date/notes for that exercise
  // NOT IMPLEMENTED YET
  getPreviousNotes(exerciseName: string): { date: string, notes: string }[] {
    let notesArr = [];
    for (var key in this.dayMaxes[exerciseName]) {
      notesArr.push({
        date: this.dayMaxes[exerciseName][key].date,
        notes: this.dayMaxes[exerciseName][key].notes
      });
    }
    return notesArr;
  }

  // Return all recorded exercise names. 
  // To be used with the edit-exercise component's suggestions for exerciseName input
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

  //#endregion

}









