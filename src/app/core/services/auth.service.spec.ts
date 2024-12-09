import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    // Clear local storage before each test
    localStorage.clear();
    
    TestBed.configureTestingModule({
      providers: [AuthService]
    });
    
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Sign Up', () => {
    it('should successfully create a new user', () => {
      const testUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      const result = service.signUp(testUser);
      
      expect(result).toBeTrue();
      
      // Check local storage
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      expect(storedUsers.length).toBe(1);
      expect(storedUsers[0].email).toBe('test@example.com');
      expect(storedUsers[0].id).toBeTruthy();
    });

    it('should prevent duplicate email registration', () => {
      const testUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };

      // First sign up should succeed
      const firstResult = service.signUp(testUser);
      expect(firstResult).toBeTrue();

      // Second sign up with same email should fail
      const secondResult = service.signUp(testUser);
      expect(secondResult).toBeFalse();

      // Check local storage still has only one user
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      expect(storedUsers.length).toBe(1);
    });
  });

  describe('Sign In', () => {
    beforeEach(() => {
      // Preset a user for sign in tests
      const testUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };
      service.signUp(testUser);
    });

    it('should successfully sign in with correct credentials', () => {
      const result = service.signIn('test@example.com', 'password123');
      
      expect(result).toBeTrue();
      
      // Check current user in local storage
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      expect(currentUser).toBeTruthy();
      expect(currentUser.email).toBe('test@example.com');
    });

    it('should fail sign in with incorrect password', () => {
      const result = service.signIn('test@example.com', 'wrongpassword');
      
      expect(result).toBeFalse();
      
      // Check no current user in local storage
      const currentUser = localStorage.getItem('currentUser');
      expect(currentUser).toBeNull();
    });

    it('should fail sign in with non-existent email', () => {
      const result = service.signIn('nonexistent@example.com', 'password123');
      
      expect(result).toBeFalse();
      
      // Check no current user in local storage
      const currentUser = localStorage.getItem('currentUser');
      expect(currentUser).toBeNull();
    });
  });

  describe('Sign Out', () => {
    beforeEach(() => {
      // Preset a user and sign in
      const testUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123'
      };
      service.signUp(testUser);
      service.signIn('test@example.com', 'password123');
    });

    it('should remove current user from local storage on sign out', () => {
      // Verify user is signed in first
      const preSignOutUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
      expect(preSignOutUser).toBeTruthy();

      // Perform sign out
      service.signOut();

      // Check current user is removed from local storage
      const currentUser = localStorage.getItem('currentUser');
      expect(currentUser).toBeNull();
    });
  });

  describe('Current User', () => {
    it('should load current user from local storage on service initialization', () => {
      // Manually set a user in local storage
      const testUser = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        password: 'password123',
        id: 'test-id'
      };
      localStorage.setItem('currentUser', JSON.stringify(testUser));

      // Reinitialize the service
      const reInitializedService = TestBed.inject(AuthService);

      // Subscribe to current user and check
      reInitializedService.getCurrentUser().subscribe(user => {
        expect(user).toBeTruthy();
        expect(user?.email).toBe('test@example.com');
      });
    });
  });
});