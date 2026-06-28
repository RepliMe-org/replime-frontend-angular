import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { AuthResponse, UserInfo } from '../models/auth.model';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  const mockAuthResponse: AuthResponse = {
    token: 'test-token-abc',
    username: 'john',
    role: 'USER',
  };

  const mockUserInfo: UserInfo = { username: 'john', role: 'USER' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('login()', () => {
    it('should POST to /api/v1/auth/login with credentials', () => {
      const creds = { email: 'john@test.com', password: 'pass123' };
      service.login(creds).subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne('/api/v1/auth/login');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(creds);
      req.flush(mockAuthResponse);
    });
  });

  describe('signup()', () => {
    it('should POST to /api/v1/auth/signup with signup data', () => {
      const signupData = {
        name: 'John',
        email: 'john@test.com',
        password: 'pass123',
      };
      service.signup(signupData).subscribe((res) => {
        expect(res).toEqual(mockAuthResponse);
      });

      const req = httpMock.expectOne('/api/v1/auth/signup');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(signupData);
      req.flush(mockAuthResponse);
    });
  });

  describe('setToken() / getToken() / clearToken()', () => {
    it('setToken should store token in localStorage', () => {
      service.setToken('my-token');
      expect(localStorage.getItem('authToken')).toBe('my-token');
    });

    it('getToken should return stored token', () => {
      localStorage.setItem('authToken', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('getToken should return null when no token stored', () => {
      expect(service.getToken()).toBeNull();
    });

    it('clearToken should remove token from localStorage', () => {
      localStorage.setItem('authToken', 'my-token');
      service.clearToken();
      expect(localStorage.getItem('authToken')).toBeNull();
    });
  });

  describe('setUserInfo() / getUserInfo()', () => {
    it('setUserInfo should JSON-serialize and store user info', () => {
      service.setUserInfo(mockUserInfo);
      const stored = localStorage.getItem('userInfo');
      expect(stored).toBe(JSON.stringify(mockUserInfo));
    });

    it('getUserInfo should deserialize and return user info', () => {
      localStorage.setItem('userInfo', JSON.stringify(mockUserInfo));
      expect(service.getUserInfo()).toEqual(mockUserInfo);
    });

    it('getUserInfo should return null when nothing is stored', () => {
      expect(service.getUserInfo()).toBeNull();
    });
  });

  describe('getUsername()', () => {
    it('should return username when user info exists', () => {
      service.setUserInfo(mockUserInfo);
      expect(service.getUsername()).toBe('john');
    });

    it('should return null when no user info', () => {
      expect(service.getUsername()).toBeNull();
    });
  });

  describe('getRole()', () => {
    it('should return role when user info exists', () => {
      service.setUserInfo(mockUserInfo);
      expect(service.getRole()).toBe('USER');
    });

    it('should return null when no user info', () => {
      expect(service.getRole()).toBeNull();
    });
  });

  describe('hasRole()', () => {
    it('should return true for matching role', () => {
      service.setUserInfo(mockUserInfo);
      expect(service.hasRole('USER')).toBeTrue();
    });

    it('should return false for non-matching role', () => {
      service.setUserInfo(mockUserInfo);
      expect(service.hasRole('ADMIN')).toBeFalse();
    });

    it('should return false when no user info stored', () => {
      expect(service.hasRole('USER')).toBeFalse();
    });
  });

  describe('isAuthenticated()', () => {
    it('should return true when token exists', () => {
      service.setToken('some-token');
      expect(service.isAuthenticated()).toBeTrue();
    });

    it('should return false when no token', () => {
      expect(service.isAuthenticated()).toBeFalse();
    });
  });

  describe('logout()', () => {
    it('should remove both authToken and userInfo from localStorage', () => {
      localStorage.setItem('authToken', 'token');
      localStorage.setItem('userInfo', JSON.stringify(mockUserInfo));

      service.logout();

      expect(localStorage.getItem('authToken')).toBeNull();
      expect(localStorage.getItem('userInfo')).toBeNull();
    });
  });

  describe('saveAuthData()', () => {
    it('should save token and user info from AuthResponse', () => {
      service.saveAuthData(mockAuthResponse);
      expect(service.getToken()).toBe('test-token-abc');
      expect(service.getUserInfo()).toEqual({ username: 'john', role: 'USER' });
    });
  });

  describe('updateUserRole()', () => {
    it('should update the role in stored user info', () => {
      service.setUserInfo(mockUserInfo);
      service.updateUserRole('INFLUENCER');
      expect(service.getRole()).toBe('INFLUENCER');
    });

    it('should do nothing when no user info is stored', () => {
      expect(() => service.updateUserRole('ADMIN')).not.toThrow();
    });
  });
});
