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
				RouterTestingModule
			],
			declarations: [HomeComponent]
		});

		let fixture = TestBed.createComponent(HomeComponent);
		let de = fixture.debugElement;
		let home = de.componentInstance

		fixture.detectChanges();
	});

	it('should create the Home Component', () => {
		expect(home).toBeTruthy();
	})
})