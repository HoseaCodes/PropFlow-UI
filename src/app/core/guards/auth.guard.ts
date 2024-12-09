import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  UrlTree, 
  Router 
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService, 
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot, 
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.getCurrentUser().pipe(
      take(1),
      map(user => {
        if (user) {
          return true;
        }
        
        // Redirect to signin page with return url
        return this.router.createUrlTree(['/signin'], {
          queryParams: { returnUrl: state.url }
        });
      })
    );
  }
}