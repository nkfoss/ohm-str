import { BehaviorSubject } from "rxjs";
import { Exercise } from "../exercise.model";

export class WorkoutServiceStub {

	exerciseUpdated = new BehaviorSubject<Exercise[]>(null);
	bodyWeightUpdated = new BehaviorSubject<number>(null);

	
}