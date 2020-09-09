import { TestBed, async } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe("HomeComponent", () => {
  let home: HomeComponent;

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

  // it("sets selected date", async () => {
  //   const date: any = { value: new Date(2017, 0, 1) };
  //   const value = home.setSelectedDate(date);
  //   console.log(value);
  //   expect(value).toEqual(
  //     "Tue Sep 08 2020 00:00:00 GMT-0500 (Central Daylight Time)"
  //   );
  // });
});
