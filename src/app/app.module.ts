import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'

import { AppComponent } from './app.component';
import { EditExerciseComponent } from './sets/edit-exercise/edit-exercise.component';
import { SetItemComponent } from './sets/set-item/set-item.component';
import { NavbarComponent } from './header/navbar.component';
import { AppRoutingModule } from './app-routing.module';
import { SetListComponent } from './sets/setList/setList.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { AlertComponent } from './shared/alert.component'

@NgModule({
  declarations: [
    AppComponent,
    EditExerciseComponent,
    SetItemComponent,
    SetListComponent,
    NavbarComponent,
    AlertComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
