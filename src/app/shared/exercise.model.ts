import { WeightReps } from "./weightReps.model"

export class Exercise {

    constructor(
        public exerciseName: string,
        public setType: string,
        public sets: WeightReps[]
    ) { }
}