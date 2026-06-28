import { TestBed } from '@angular/core/testing';
import {
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { oauthGuard } from './oauth.guard';
import { AuthService } from '../services/auth.service';

describe('oauthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockState = {} as RouterStateSnapshot;

  function buildRoute(
    queryParams: Record<string, string>,
  ): ActivatedRouteSnapshot {
    return { queryParams } as unknown as ActivatedRouteSnapshot;
  }

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['saveAuthData']);
    routerSpy = jasmine.createSpyObj('Router', ['createUrlTree']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });
  });

  it('should save auth data and redirect to "/" when all params present', () => {
    const mockRoute = buildRoute({
      token: 'tok123',
      username: 'John Doe',
      role: 'USER',
    });
    const mockUrlTree = {} as UrlTree;
    routerSpy.createUrlTree.and.returnValue(mockUrlTree);

    const result = TestBed.runInInjectionContext(() =>
      oauthGuard(mockRoute, mockState),
    );

    expect(authServiceSpy.saveAuthData).toHaveBeenCalledWith({
      token: 'tok123',
      username: 'John', // only first name
      role: 'USER',
    });
    expect(routerSpy.createUrlTree).toHaveBeenCalledWith(['/']);
    expect(result).toBe(mockUrlTree);
  });

  it('should use only the first word of username', () => {
    const mockRoute = buildRoute({
      token: 'tok123',
      username: 'John Michael Doe',
      role: 'ADMIN',
    });
    routerSpy.createUrlTree.and.returnValue({} as UrlTree);

    TestBed.runInInjectionContext(() => oauthGuard(mockRoute, mockState));

    expect(authServiceSpy.saveAuthData).toHaveBeenCalledWith(
      jasmine.objectContaining({ username: 'John' }),
    );
  });

  it('should return true and NOT save auth data when token is missing', () => {
    const mockRoute = buildRoute({
      username: 'John',
      role: 'USER',
    });

    const result = TestBed.runInInjectionContext(() =>
      oauthGuard(mockRoute, mockState),
    );

    expect(authServiceSpy.saveAuthData).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should return true and NOT save auth data when username is missing', () => {
    const mockRoute = buildRoute({
      token: 'tok123',
      role: 'USER',
    });

    const result = TestBed.runInInjectionContext(() =>
      oauthGuard(mockRoute, mockState),
    );

    expect(authServiceSpy.saveAuthData).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should return true and NOT save auth data when role is missing', () => {
    const mockRoute = buildRoute({
      token: 'tok123',
      username: 'John',
    });

    const result = TestBed.runInInjectionContext(() =>
      oauthGuard(mockRoute, mockState),
    );

    expect(authServiceSpy.saveAuthData).not.toHaveBeenCalled();
    expect(result).toBeTrue();
  });

  it('should return true when no query params are present', () => {
    const mockRoute = buildRoute({});

    const result = TestBed.runInInjectionContext(() =>
      oauthGuard(mockRoute, mockState),
    );

    expect(result).toBeTrue();
    expect(authServiceSpy.saveAuthData).not.toHaveBeenCalled();
  });
});
