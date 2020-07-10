import { WeightReps } from "./weightReps.model"

export class Exercise {

    constructor(
        public exerciseName: string,
        public setType: string,
        public warmupSets: WeightReps[],
        public sets: WeightReps[]
    ) { }
}