import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth/auth.service';
import { AuthServiceStub } from '../shared/mocks/auth.service.mock';
import { NavbarComponent } from './navbar.component';

describe('navbar', () => {
  let navbar: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let router: Router;

  // let authServiceStub: {
  // 	userSub: Subscription;
  // };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [{ provide: AuthService, useClass: AuthServiceStub }]
    });

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavbarComponent);
    navbar = fixture.debugElement.componentInstance;
    fixture.detectChanges();

  });

  it('should create the Navbar Component', () => {
    expect(navbar).toBeTruthy();
  });

  it('should not be initially authenticated', () => {
    expect(navbar.isAuthenticated).toBe(false);
  });

  it('should not be authenticated after logout', () => {
    navbar.isAuthenticated = true;
    navbar.onLogout();
    expect(navbar.isAuthenticated).toBe(false);
  });

  it('should navigate to homepage', () => {
    const navigateSpy = spyOn(router, 'navigate');
    navbar.onNavigateHome();
    expect(navigateSpy).toHaveBeenCalledWith(['home']);
  });

  it('should navigate to the current day', () => {
    const navigateSpy = spyOn(router, 'navigate');

    const today = navbar.formatDatePipe.transform(new Date().toDateString(), 'LLL d y');
    navbar.onNavigateToToday();
    expect(navigateSpy).toHaveBeenCalledWith(['workout/' + today]);
  });
});
