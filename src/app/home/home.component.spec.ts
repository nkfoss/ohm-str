import { BoundElementProperty } from "@angular/compiler";
import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { Router } from "@angular/router";
import { RouterTestingModule } from "@angular/router/testing";
import { HomeComponent } from "./home.component"

describe("home", () => {
	let home: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes([])
			],
			declarations: [HomeComponent]
		});

		fixture = TestBed.createComponent(HomeComponent);
		home = fixture.componentInstance
		router = TestBed.inject(Router);
		
		fixture.detectChanges();
	});

	it('should create the Home Component', () => {
		expect(home).toBeTruthy();
	})

	it('should navigate to the current day', () => {
		const navigateSpy = spyOn(router, 'navigate');
		
		const today = home.formatDatePipe.transform(new Date().toDateString(), 'LLL d y');
		home.getTodaysWorkout();
		expect(navigateSpy).toHaveBeenCalledWith(['workout/' + today])
	});
	
	it('should navigate to a given date', () => {
		const navigateSpy = spyOn(router, 'navigate');

		home.formattedDate = "Nov 5 2020";
		home.navigateToDate();
		expect(navigateSpy).toHaveBeenCalledWith(['workout/Nov 5 2020'])
	})


})