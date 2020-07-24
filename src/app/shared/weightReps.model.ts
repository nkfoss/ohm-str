export class WeightReps{
    constructor(
        public weight: number, 
        public reps: number,
        public restPauseSets?: number[],
        public dropSets?: {weight: number, reps: number}[]
        ) {}
}