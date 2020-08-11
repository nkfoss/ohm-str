import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { AppComponent } from './app.component';
import { EditExerciseComponent } from './sets/edit-exercise/edit-exercise.component';
import { SetItemComponent } from './sets/set-item/set-item.component';
import { NavbarComponent } from './header/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { SetListComponent } from './sets/setList/setList.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth/auth.component'
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

import { MatInputModule } from '@angular/material/input'
import { MatSelectModule } from '@angular/material/select'


@NgModule({
  declarations: [
    AppComponent,
    EditExerciseComponent,
    SetItemComponent,
    SetListComponent,
    NavbarComponent,
    HomeComponent,
    AuthComponent,
    LoadingSpinnerComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatSelectModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true }
  ],
  bootstrap: [AppComponent] // This defines which component(s) is available in the index.html file.
})
export class AppModule { }
