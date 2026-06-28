import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = {} as RouterStateSnapshot;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['hasRole']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should return true when user has the required role', () => {
    authServiceSpy.hasRole.and.returnValue(true);

    const guard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState),
    );

    expect(authServiceSpy.hasRole).toHaveBeenCalledWith('ADMIN');
    expect(result).toBeTrue();
  });

  it('should return a UrlTree to /dashboard when user does NOT have the required role', () => {
    authServiceSpy.hasRole.and.returnValue(false);
    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    const guard = roleGuard('ADMIN');
    const result = TestBed.runInInjectionContext(() =>
      guard(mockRoute, mockState),
    );

    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/dashboard']);
    expect(result).toBe(mockUrlTree);
  });

  it('should use the specific role string passed to the factory', () => {
    authServiceSpy.hasRole.and.returnValue(true);

    const guard = roleGuard('INFLUENCER');
    TestBed.runInInjectionContext(() => guard(mockRoute, mockState));

    expect(authServiceSpy.hasRole).toHaveBeenCalledWith('INFLUENCER');
  });
});
