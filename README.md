# Omega-Strength

Omega-Strength (abrv: Ohm-str) is a web application for strength trainers. It allows the users to record their training, track records, and compare current performance with those records. It was created in Angular, uses Firebases's Realtime Database (NoSQL), and is hosted by Firebase as well.

## Table of Contents
+ [Introduction](#introduction)
+ [Technologies](#technologies)
+ [Functionality](#functionality)
+ [Questions?](#Questions?)

## Introduction

This project was created by me ([Nathan Foss](https://www.nathankfoss.me)) as way to exhibit my continuous learning of Angular. As a new grad, I figured it would useful for potential employers to see what I can do on my own. It also shows one of my primary interests: strength training. This application is also a tool that I use in my own training regimen.

The application was built mobile-first with an eye for simplicity. The functionality and interface are meant to emulate a strength logbook (of which many trainers still use). With the addition of material-design components, the application is very straight-forward.

While this particular version of Ohm-Str is no longer in active development, I am currrently rebuilding it in React. Much of the functionality is the same, though the stack differs. Check out the progress in my [repository here](https://github.com/nkfoss/Ohm-str-react).

## Technologies

- Angular 8+
- Typescript
- RxJS
- Bootstrap 4+
- Karma / Jasmine
- Angular-Material
- Node.js

## Functionality

Lorem ipsum, and then some. Lorem ipsum, and then some.Lorem ipsum, and then some.Lorem ipsum, and then some.Lorem ipsum, and then some.Lorem ipsum, and then some.Lorem ipsum, and then some.Lorem ipsum, and then some.Lorem ipsum, and then some.Lorem ipsum, and then some.

### Login and getting started

Ohm-Str uses Firebase Authentication (leveraging OAuth 2.0). Existing users can sign in, but all new sers must personally ask me to sign up. Once signed in, the landing page displays a datepicker. You can chose a past date when you worked out, the current day, or plan workouts for a future date.

<table>
  <tr>
    <td>Authentication</td>
     <td>Home page</td>
     <td>Datepicker</td>
  </tr>
  <tr>
    <td><img src="./src/assets/images/login.png" ></td>
    <td><img src="./src/assets/images/landing.png" ></td>
    <td><img src="./src/assets/images/landing_dp.png" ></td>
  </tr>
 </table>

 ### Entering exercises

After picking a date, you can start adding exercise entries (as well as bodyweight) for that day. When adding an exercise, you can either enter a new name, or choose from a list of previously entered exercise names (taken from the database). We will use the "front squat" exercise for this example.

<table>
  <tr>
    <td> <strong> The workout </strong> </td>
     <td><strong> Add exercise </strong> </td>
     <td><strong> Name autofill </strong></td>
  </tr>
  <tr>
    <td><img src="./src/assets/images/editworkout.png" ></td>
    <td><img src="./src/assets/images/editexercise.png" ></td>
    <td><img src="./src/assets/images/autofill.png" ></td>
  </tr>
 </table>

  ### Set-types, notes, and warm-ups

You have some options for customizing the exercise. Ohm-Str supports different types of sets, including varieties of rest-pause and drop-sets (we will use regular sets for now). 

Since this app is meant to emulate a logbook, you can write notes for an exercise and access notes from previous logs (for the current exercise). This can be informative for you to adjust your working sets in relation to your previous results.

In addition to working sets, you can enter your warm-up sets. 

 <table>
  <tr>
	<td><strong> Set types </strong></td>
    <td><strong> Previous notes </strong></td>
     <td><strong> Warm-ups and working sets </strong></td>
  </tr>
  <tr>
	<td><img src="./src/assets/images/settypes.png" ></td>
	<td><img src="./src/assets/images/notes.png" ></td>
    <td><img src="./src/assets/images/sets.png" ></td>
  
  </tr>
 </table>

 ### Previous records and saving progress

After saving the exercise, the workout page displays your results (*notice that warm-up sets are not displayed*). Each exercise has a table with the exercise name, set-type, and the previously calculated **one-rep maximum record (1rm)**. Your calculated 1rm is the metric by which all strength-training progress is measured. **You can read more about it [here](https://en.wikipedia.org/wiki/One-repetition_maximum)**.

Each row in the table represents a set performed for that exercise. It displays the weight and reps, but also a metric to compare your performance to the previously set record. In our example, this means that 190 lbs. at 7 repetitions calculated to a 1rm (about 228 lbs) that was *1.08 times that of the previous record*. 

Similarly, sets that fall below the record are also shown. Both can be important for tracking your progress and adjusting your program.

When you are done with your workout, you click the 'save workout' button. You should receive a notification from the server if your workout was saved succesfully, or if there was an error.

 <table>
  <tr>
	<td><strong> Exercise display </strong></td>
    <td><strong> Progress vs. records </strong></td>
     <td><strong> Saving progress </strong></td>
  </tr>
  <tr>
	<td><img src="./src/assets/images/recordview.png" ></td>
	<td><img src="./src/assets/images/lower_record.png" ></td>
    <td><img src="./src/assets/images/saved_workout.png" ></td>
  
  </tr>
 </table>

 ## Questions?

If you have any questions or comments, please contact me through my personal website: [nathankfoss.me](https://www.nathankfoss.me). I usually will reply the same day.