import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { NavbarComponent } from "./navbar.component";
import { FormBuilder } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe("NavbarComponent", () => {
  let home: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [FormBuilder],
    }).compileComponents();
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(NavbarComponent);
      home = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it("should be created", async(() => {
    expect(home).toBeTruthy();
  }));
});
