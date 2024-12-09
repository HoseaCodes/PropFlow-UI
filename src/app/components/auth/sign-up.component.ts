import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    RouterModule
  ]
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      firstName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      lastName: ['', [
        Validators.required, 
        Validators.minLength(2),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required, 
        Validators.email
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.maxLength(30)
      ]]
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;

    if (this.signupForm.invalid) {
      return;
    }

    try {
      const success = this.authService.signUp(this.signupForm.value);
      
      if (success) {
        this.router.navigate(['/']);
      } else {
        // Handle signup failure
        console.error('Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      // Handle error (show user-friendly message)
    }
  }

  // Convenience getter for easy access to form fields
  get f() { 
    return this.signupForm.controls; 
  }
}