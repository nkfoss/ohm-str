import { TestBed, async } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe("HomeComponent", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [],
    }).compileComponents();
  });

  it("should be created", async(() => {
    const fixture = TestBed.createComponent(HomeComponent); // 'fixture' is a common name for the comp
    const home = fixture.debugElement.componentInstance; // gets the actual component (aka the app itself)
    expect(home).toBeTruthy();
  }));
});
