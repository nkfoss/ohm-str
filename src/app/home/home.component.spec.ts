import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { WorkoutService } from "../workout.service";
import { HomeComponent } from "./home.component"

describe("home", () => {
	let home: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;

	let workoutServiceStub: {};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule
			],
			declarations: [HomeComponent],
			providers: [
				{ provide: WorkoutService, useValue: workoutServiceStub }
			]

		});
	});

	it('should create the Home Component', () => {
		let fixture = TestBed.createComponent(HomeComponent);
		let HC = fixture.debugElement.componentInstance;
		expect(HC).toBeTruthy();
	})
})