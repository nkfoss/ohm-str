import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'

import { AppComponent } from './app.component';
import { EditExerciseComponent } from './sets/edit-exercise/edit-exercise.component';
import { SetItemComponent } from './sets/set-item/set-item.component';
import { NavbarComponent } from './header/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { SetListComponent } from './sets/setList/setList.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AlertComponent } from './shared/alert.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth/auth.component'
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner';
import { AuthInterceptorService } from './auth/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    EditExerciseComponent,
    SetItemComponent,
    SetListComponent,
    NavbarComponent,
    AlertComponent,
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
    BrowserAnimationsModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
