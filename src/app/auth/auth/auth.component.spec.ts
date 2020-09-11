import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { AuthComponent } from "./auth.component";
import { FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe("AuthComponent", () => {
  let home: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [FormBuilder],
    }).compileComponents();
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(AuthComponent);
      home = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it("should be created", async(() => {
    expect(home).toBeTruthy();
  }));
});
