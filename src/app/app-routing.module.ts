import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditExerciseComponent } from './sets/edit-exercise/edit-exercise.component';
import { SetListComponent } from './sets/setList/setList.component';
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth/auth.component';
import { AuthGuard } from './auth/auth/auth.guard';

// ======================================================

const appRoutes: Routes = [

  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},

  {path: 'auth', component: AuthComponent},

  {path: 'workouts', component: SetListComponent, canActivate: [AuthGuard]},

  {path: 'exercise',
  canActivate: [AuthGuard],
  children: [
    {path: ':exerciseId/edit', component: EditExerciseComponent},
    {path: 'new', component: EditExerciseComponent}
  ]},

  {path: '', redirectTo: 'auth', pathMatch: 'full'}

];

@NgModule({
  imports: [ RouterModule.forRoot(appRoutes) ],
  exports: [ RouterModule ]
})

// ======================================================

export class AppRoutingModule { }
