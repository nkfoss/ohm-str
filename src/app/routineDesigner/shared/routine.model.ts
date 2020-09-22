import { RoutineDay } from "./routine-day.model";

export class Routine {
	constructor(
		public name: string,
		public notes: string,
		public days: RoutineDay[],
		public currentDay: number,
		public numCycles: number
	) { }
}
