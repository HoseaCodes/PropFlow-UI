import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { SignInComponent } from './sign-in.component';
import { AuthService } from '../../core/services/auth.service';

describe('SignInComponent', () => {
  let component: SignInComponent;
  let fixture: ComponentFixture<SignInComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let activatedRouteMock: any;

  beforeEach(async () => {
    // Create spy objects
    const authSpy = jasmine.createSpyObj('AuthService', ['signIn']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigateByUrl']);

    // Mock ActivatedRoute
    activatedRouteMock = {
      snapshot: {
        queryParams: {
          returnUrl: '/dashboard'
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        SignInComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();

    // Create component and inject dependencies
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.signinForm).toBeTruthy();
    expect(component.signinForm.get('email')?.value).toBe('');
    expect(component.signinForm.get('password')?.value).toBe('');
  });

  it('should set returnUrl from route parameters', () => {
    expect(component.returnUrl).toBe('/dashboard');
  });

  it('should set default returnUrl when no route parameter exists', () => {
    // Override mock to simulate no returnUrl
    activatedRouteMock.snapshot.queryParams = {};
    
    // Reinitialize component
    fixture = TestBed.createComponent(SignInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.returnUrl).toBe('/');
  });

  it('form should be invalid when empty', () => {
    expect(component.signinForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let email = component.signinForm.get('email');
    
    // Email required
    email?.setValue('');
    expect(email?.valid).toBeFalsy();

    // Invalid email format
    email?.setValue('invalid-email');
    expect(email?.valid).toBeFalsy();

    // Valid email
    email?.setValue('test@example.com');
    expect(email?.valid).toBeTruthy();
  });

  it('password field validity', () => {
    let password = component.signinForm.get('password');
    
    // Password required
    password?.setValue('');
    expect(password?.valid).toBeFalsy();

    // Valid password
    password?.setValue('password123');
    expect(password?.valid).toBeTruthy();
  });

  it('should call authService.signIn and navigate on successful login', () => {
    // Setup form with valid credentials
    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Mock successful login
    authServiceSpy.signIn.and.returnValue(true);

    // Trigger form submission
    component.onSubmit();

    // Expect signIn method to be called with correct credentials
    expect(authServiceSpy.signIn).toHaveBeenCalledWith(
      'test@example.com', 
      'password123'
    );

    // Expect navigation to returnUrl
    expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/dashboard');
  });

  it('should show alert on failed login', () => {
    // Spy on window alert
    spyOn(window, 'alert');

    // Setup form with valid credentials
    component.signinForm.setValue({
      email: 'test@example.com',
      password: 'password123'
    });

    // Mock failed login
    authServiceSpy.signIn.and.returnValue(false);

    // Trigger form submission
    component.onSubmit();

    // Expect alert to be called
    expect(window.alert).toHaveBeenCalledWith('Invalid email or password');
    
    // Expect no navigation
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });

  it('should not submit form when invalid', () => {
    // Setup invalid form
    component.signinForm.setValue({
      email: 'invalid-email',
      password: ''
    });

    // Trigger form submission
    component.onSubmit();

    // Expect no service calls or navigation
    expect(authServiceSpy.signIn).not.toHaveBeenCalled();
    expect(routerSpy.navigateByUrl).not.toHaveBeenCalled();
  });
});