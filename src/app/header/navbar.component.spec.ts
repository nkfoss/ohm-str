import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "../auth/auth.service";
import { NavbarComponent } from "./navbar.component"

describe("navbar", () => {
	let navbar: NavbarComponent;
	let fixture: ComponentFixture<NavbarComponent>;
	let router: Router;

	let authServiceStub: {};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			declarations: [NavbarComponent],
			providers: [
				{ provide: AuthService, useValue: authServiceStub }
			]
		});

		fixture = TestBed.createComponent(NavbarComponent);
		navbar = fixture.componentInstance;
		router = TestBed.inject(Router);

		fixture.detectChanges();
	});

	it('should create the Navbar Component', () => {
		expect(navbar).toBeTruthy();
	})

	it('should navigate to homepage', () => {
		const navigateSpy = spyOn(router, 'navigate');
		navbar.onNavigateHome();
		expect(navigateSpy).toHaveBeenCalledWith(['home']);
	})

	it('should navigate to the current day', () => {
		const navigateSpy = spyOn(router, 'navigate');

		const today = navbar.formatDatePipe.transform(new Date().toDateString(), 'LLL d y');
		navbar.onNavigateToToday();
		expect(navigateSpy).toHaveBeenCalledWith(['workout/' + today])
	})
})