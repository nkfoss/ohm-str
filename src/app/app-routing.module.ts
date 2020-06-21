import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from "@angular/router"
import { EditExerciseComponent } from './sets/edit-exercise/edit-exercise.component';
import { SetListComponent } from './sets/setList/setList.component';

// ======================================================

const appRoutes: Routes = [

  {path: 'exercises', component: SetListComponent},
  {path: 'exercises/:exerciseId/edit', component: EditExerciseComponent},
  {path: 'exercises/new', component: EditExerciseComponent}

]

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})

// ======================================================

export class AppRoutingModule { }
