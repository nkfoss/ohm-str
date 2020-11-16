import { BehaviorSubject } from "rxjs";
import { User } from "src/app/auth/user.model";

export class AuthServiceStub {
	userSubject = new BehaviorSubject<User>(null);

	logout() {
		this.userSubject.next(null);
	}
}