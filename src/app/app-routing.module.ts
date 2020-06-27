import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from "@angular/router"
import { EditExerciseComponent } from './sets/edit-exercise/edit-exercise.component';
import { SetListComponent } from './sets/setList/setList.component';
import { HomeComponent } from './home/home.component';

// ======================================================

const appRoutes: Routes = [

  {path: 'home', component: HomeComponent},

  {path: 'workout/:date', component: SetListComponent },

  {path: 'exercise', 
  children: [
    {path: ':exerciseId/edit', component: EditExerciseComponent},
    {path: 'new', component: EditExerciseComponent}
  ]},

  // {path: '', redirectTo: 'home', pathMatch: 'full'}

]

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})

// ======================================================

export class AppRoutingModule { }
