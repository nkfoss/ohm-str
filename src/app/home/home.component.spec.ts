import { DebugElement } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { HomeComponent } from "./home.component"

describe("home", () => {
	let home: HomeComponent;
	let fixture: ComponentFixture<HomeComponent>;
	let de: DebugElement;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule.withRoutes([])
			],
			declarations: [HomeComponent]
		});

		fixture = TestBed.createComponent(HomeComponent);
		de = fixture.debugElement;
		home = de.componentInstance

		fixture.detectChanges();
	});

	it('should create the Home Component', () => {
		expect(home).toBeTruthy();
	})
})