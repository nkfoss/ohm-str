import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

	constructor(private authService: AuthService,
    	private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
		boolean |
    	Promise<boolean | UrlTree> |
    	Observable<boolean | UrlTree> |
    	UrlTree {
    	return this.authService.userSubject.pipe(
			take(1),
			map(user => {
				const isAuthenticated = !!user; // **see below
				if (isAuthenticated) { return true; } else { return this.router.createUrlTree(['/auth']); }
			}),
    	);
  }
  // What's happening here?
  //    An observable holding a boolean is being returned in the end.
  // 	  If the boolean is true, then the user is granted access. Otherwise they are redirected.
  // 	  In our case, we are checking to see if a user object exists (implying the user is authenticated).
  //  While the user subject IS an observable, it does not necessarily return a boolean in the end.
  //    ** So instead of just returning this.service.userSubject, we use pipe/map to get a boolean.

}
