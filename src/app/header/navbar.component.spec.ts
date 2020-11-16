import { ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "../auth/auth.service";
import { NavbarComponent } from "./navbar.component"

describe("navbar", () => {
	let navbar: NavbarComponent;
	let fixture: ComponentFixture<NavbarComponent>;

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
	});

	it('should create the Navbar Component', () => {
		let fixture = TestBed.createComponent(NavbarComponent);
		let NC = fixture.debugElement.componentInstance;
		expect(NC).toBeTruthy();
	})
})