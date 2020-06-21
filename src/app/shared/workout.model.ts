import { Exercise } from './exercise.model'


export class Workout {
	constructor(public date: Date, public category: string, public notes: string, public exercises: Exercise[]) {}
}