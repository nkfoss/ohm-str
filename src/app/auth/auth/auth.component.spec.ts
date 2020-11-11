import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from "../auth.service";
import { AuthComponent } from "./auth.component"

describe("auth", () => {
	let auth: AuthComponent;
	let fixture: ComponentFixture<AuthComponent>;

	let authServiceStub: {};

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterTestingModule,
				ReactiveFormsModule
			],
			declarations: [AuthComponent],
			providers: [
				{ provide: AuthService, useValue: authServiceStub}
			]
		});
	});

	it('should create the Auth Component', () => {
		let fixture = TestBed.createComponent(AuthComponent);
		let AC = fixture.debugElement.componentInstance;
		expect(AC).toBeTruthy();
	})
})