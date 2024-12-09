import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { of, Observable } from 'rxjs';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let mockRouteSnapshot: ActivatedRouteSnapshot;
  let mockRouterStateSnapshot: RouterStateSnapshot;

  beforeEach(() => {
    // Create spy objects
    const authSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    // Inject the guard and dependencies
    authGuard = TestBed.inject(AuthGuard);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Create mock route and state snapshots
    mockRouteSnapshot = {} as ActivatedRouteSnapshot;
    mockRouterStateSnapshot = {
      url: '/protected-route'
    } as RouterStateSnapshot;
  });

  it('should be created', () => {
    expect(authGuard).toBeTruthy();
  });

  it('should allow access when user is authenticated', (done) => {
    // Mock authenticated user
    const mockUser = { id: '123', email: 'test@example.com' };
    authServiceSpy.getCurrentUser.and.returnValue(of(mockUser));

    // Call canActivate
    const canActivate = authGuard.canActivate(
      mockRouteSnapshot, 
      mockRouterStateSnapshot
    ) as Observable<boolean | any>;

    canActivate.subscribe(result => {
      expect(result).toBe(true);
      done();
    });
  });

  it('should redirect to signin page when user is not authenticated', (done) => {
    // Mock no user (null)
    authServiceSpy.getCurrentUser.and.returnValue(of(null));

    // Create mock UrlTree for redirection
    const mockUrlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    // Call canActivate
    const canActivate = authGuard.canActivate(
      mockRouteSnapshot, 
      mockRouterStateSnapshot
    ) as Observable<boolean | any>;

    canActivate.subscribe(result => {
      // Expect redirection URL tree
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { returnUrl: '/protected-route' }
      });
      expect(result).toBe(mockUrlTree);
      done();
    });
  });

  it('should pass correct return URL when redirecting', (done) => {
    // Mock different route URL
    const differentRouteSnapshot = {
      url: '/admin/dashboard'
    } as RouterStateSnapshot;

    // Mock no user (null)
    authServiceSpy.getCurrentUser.and.returnValue(of(null));

    // Create mock UrlTree for redirection
    const mockUrlTree = {} as any;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    // Call canActivate with different route
    const canActivate = authGuard.canActivate(
      mockRouteSnapshot, 
      differentRouteSnapshot
    ) as Observable<boolean | any>;

    canActivate.subscribe(result => {
      // Verify correct return URL is passed
      expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/signin'], {
        queryParams: { returnUrl: '/admin/dashboard' }
      });
      done();
    });
  });

  it('should take only one emission from getCurrentUser', (done) => {
    // Create an observable that emits multiple values
    const multiEmissionUser = new Observable(subscriber => {
      subscriber.next({ id: '1' });
      subscriber.next({ id: '2' });
      subscriber.next(null);
    });

    // Replace getCurrentUser with multi-emission observable
    authServiceSpy.getCurrentUser.and.returnValue(multiEmissionUser);

    // Call canActivate
    const canActivate = authGuard.canActivate(
      mockRouteSnapshot, 
      mockRouterStateSnapshot
    ) as Observable<boolean | any>;

    let emissionCount = 0;
    canActivate.subscribe({
      next: () => {
        emissionCount++;
      },
      complete: () => {
        // Ensure only one emission occurred
        expect(emissionCount).toBe(1);
        done();
      }
    });
  });
});