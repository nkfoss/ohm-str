import { Exercise } from './exercise.model'


export class Workout {
	constructor(
		public dateString: string, 
		public category: string, 
		public notes: string, 
		public exercises: Exercise[],
		public bodyweight?: number) {}
}
