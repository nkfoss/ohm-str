import { ComponentFixture, TestBed, async } from "@angular/core/testing";
import { HomeComponent } from "./home.component";
import { RouterTestingModule } from "@angular/router/testing";
import { HttpClientModule } from "@angular/common/http";

describe("HomeComponent", () => {
  let home: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [RouterTestingModule, HttpClientModule],
      providers: [],
    }).compileComponents();
  });

  beforeEach(async(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(HomeComponent);
      home = fixture.componentInstance;
      fixture.detectChanges();
    });
  }));

  it("should be created", async(() => {
    expect(home).toBeTruthy();
  }));

  // it("sets selected date", async () => {
  //   const date: any = { value: new Date(2017, 0, 1) };
  //   const fixture = TestBed.createComponent(HomeComponent); // 'fixture' is a common name for the comp
  //   const home = fixture.debugElement.componentInstance; // gets the actual component (aka the app itself)
  //   const value = home.setSelectedDate(date);
  //   console.log("value: " + value);
  //   expect(value).toEqual(
  //     "Tue Sep 08 2020 00:00:00 GMT-0500 (Central Daylight Time)"
  //   );
  // });
});
