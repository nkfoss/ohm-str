import { RoutineBackup } from "./routine-backup.model";
import { RoutineSet } from "./routine-set.model";

export class RoutineExercise {
	constructor(
		name: string, 
		sets: RoutineSet[], 
		currSet: number, 
		currIteration: number, 
		backup: RoutineBackup
		) {}
}