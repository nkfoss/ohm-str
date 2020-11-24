export class RepmaxServiceStub {
	recordMaxes: {};
	dayMaxes: {};

	fetchRecords() {
		this.fetchDayMaxes();
		this.fetchRecordMaxes();
	}

	fetchDayMaxes() {
		this.dayMaxes = {}
	}

	fetchRecordMaxes(){
		this.recordMaxes = {
			"bench press": 200,
			"deadlift": 300,
			"squat": 275
		}
	}

	getRecordMaxFromName(exerciseName: string): number {
		let records = this.recordMaxes
		for (var key in records) {
		  if (records.hasOwnProperty(key)) {
			if (key == exerciseName) {
			  return (records[key])
			}
		  }
		}
	  }

	patchDayMaxes() {};
	patchRecordMaxes() {};
	
}