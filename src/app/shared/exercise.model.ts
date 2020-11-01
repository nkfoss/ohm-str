import { WeightReps } from "./weightReps.model"

export class Exercise {

    constructor(
        public exerciseName: string,
        public setType: string,
        public exerciseNotes: string,
        public momentaryMax: number,
        public warmupSets: WeightReps[],
        public sets: WeightReps[]
    ) { }
}