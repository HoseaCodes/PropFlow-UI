import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { User } from '../../../models/user.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout-header',
  imports: [
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})

export class HeaderComponent implements OnInit {
  constructor(private authService: AuthService) {}

  isMobileMenuOpen = false;
  currentUser: User | null = null;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }
}