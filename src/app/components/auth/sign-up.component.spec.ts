import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { SignUpComponent } from './sign-up.component';
import { AuthService } from '../../core/services/auth.service';

describe('SignUpComponent', () => {
  let component: SignUpComponent;
  let fixture: ComponentFixture<SignUpComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['signUp']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        SignUpComponent
      ],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignUpComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  it('email field validity', () => {
    let email = component.signupForm.controls['email'];
    
    // Email required
    email.setValue('');
    expect(email.valid).toBeFalsy();

    // Invalid email
    email.setValue('test');
    expect(email.valid).toBeFalsy();

    // Valid email
    email.setValue('test@example.com');
    expect(email.valid).toBeTruthy();
  });

  it('password field validity', () => {
    let password = component.signupForm.controls['password'];
    
    // Password required
    password.setValue('');
    expect(password.valid).toBeFalsy();

    // Too short
    password.setValue('short');
    expect(password.valid).toBeFalsy();

    // Valid password
    password.setValue('validpassword');
    expect(password.valid).toBeTruthy();
  });

  it('should call authService.signUp on valid form submission', () => {
    // Set up valid form data
    component.signupForm.setValue({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    // Mock successful signup
    authServiceSpy.signUp.and.returnValue(true);

    // Trigger form submission
    component.onSubmit();

    // Expect signup method to be called
    expect(authServiceSpy.signUp).toHaveBeenCalledWith({
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    // Expect navigation on successful signup
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not submit form when invalid', () => {
    // Intentionally leave form invalid
    component.signupForm.setValue({
      firstName: '',
      lastName: '',
      email: 'invalid-email',
      password: 'short'
    });

    // Trigger form submission
    component.onSubmit();

    // Expect signup method not to be called
    expect(authServiceSpy.signUp).not.toHaveBeenCalled();
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });
});