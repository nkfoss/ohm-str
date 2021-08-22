import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NavbarComponent } from './header/navbar.component';

// What is this 'async' import?
// It's for testing with methods that are asynchronous.

// Here, we are bootstrapping the application.
describe('App: Ohm-str', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        NavbarComponent
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ]
    });
  });

  // This will check that the app was properly created.
  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent); // 'fixture' is a common name for the comp
    const app = fixture.debugElement.componentInstance; // gets the actual component (aka the app itself)
    expect(app).toBeTruthy();
  }));

  // This will check a particular property of the comp..
  it('should have an AuthService', async( () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.authService).toBeTruthy();
  }));

  // To access the template for testing, see Max's example in lecture 422.

});
