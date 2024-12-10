import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { SignInCredentials } from '../../models/user.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ]
})
export class SignInComponent implements OnInit {
  signinForm: FormGroup;
  returnUrl: string = '/';
  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onSubmit() {
    if (this.signinForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const credentials: SignInCredentials = {
        email: this.signinForm.value.email,
        username: this.signinForm.value.username,
        password: this.signinForm.value.password
      };

      this.authService.signIn(credentials).subscribe({
        next: (response) => {
          if (response.error) {
            this.errorMessage = response.error;
          } else {
            this.router.navigateByUrl(this.returnUrl);
          }
        },
        error: (error) => {
          this.errorMessage = 'An unexpected error occurred. Please try again.';
          console.error('Sign in error:', error);
        },
        complete: () => {
          this.isLoading = false;
        }
      });
    }
  }
}