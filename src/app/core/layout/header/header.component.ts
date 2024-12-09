import { Component } from '@angular/core';

@Component({
  selector: 'app-layout-header',
  imports: [],
  template: `
    <nav class="border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4">
        <div class="flex items-center justify-between h-20">
          <!-- Logo Section -->
          <div class="flex-shrink-0 flex items-center">
            <a href="/" class="text-rose-500 font-semibold text-xl">
              PropFlow
            </a>
          </div>

          <!-- Main Navigation -->
          <div class="hidden md:flex items-center justify-center flex-1 px-8">
            <div class="flex space-x-8">
              <a href="/" 
                 routerLinkActive="text-gray-900"
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </a>
              <a href="/dashboard" 
                 routerLinkActive="text-gray-900"
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Dashboard
              </a>
              <a href="/bookings" 
                 routerLinkActive="text-gray-900"
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Bookings
              </a>
              <a href="/transactions" 
                 routerLinkActive="text-gray-900"
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Transactions
              </a>
              <a href="/properties" 
                 routerLinkActive="text-gray-900"
                 class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                Properties
              </a>
            </div>
          </div>

          <!-- Right side buttons -->
          <div class="flex items-center space-x-4">
            <button class="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" 
                   class="h-5 w-5" 
                   fill="none" 
                   viewBox="0 0 24 24" 
                   stroke="currentColor">
                <path stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            
            <button class="flex items-center space-x-2 text-gray-700 hover:shadow-md border border-gray-200 rounded-full p-2 transition-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" 
                   class="h-5 w-5" 
                   fill="none" 
                   viewBox="0 0 24 24" 
                   stroke="currentColor">
                <path stroke-linecap="round" 
                      stroke-linejoin="round" 
                      stroke-width="2" 
                      d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <div class="h-8 w-8 rounded-full bg-gray-500"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile menu button -->
      <div class="md:hidden">
        <button (click)="toggleMobileMenu()" 
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-rose-500">
          <span class="sr-only">Open main menu</span>
          <svg class="h-6 w-6" 
               [class.hidden]="isMobileMenuOpen" 
               [class.block]="!isMobileMenuOpen" 
               xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg class="h-6 w-6" 
               [class.block]="isMobileMenuOpen" 
               [class.hidden]="!isMobileMenuOpen" 
               xmlns="http://www.w3.org/2000/svg" 
               fill="none" 
               viewBox="0 0 24 24" 
               stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu -->
      <div class="md:hidden" [class.block]="isMobileMenuOpen" [class.hidden]="!isMobileMenuOpen">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a href="/" 
             routerLinkActive="bg-gray-100 text-gray-900"
             class="text-gray-500 hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
            Home
          </a>
          <a href="/dashboard" 
             routerLinkActive="bg-gray-100 text-gray-900"
             class="text-gray-500 hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
            Dashboard
          </a>
          <a href="/bookings" 
             routerLinkActive="bg-gray-100 text-gray-900"
             class="text-gray-500 hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
            Bookings
          </a>
          <a href="/expenses" 
             routerLinkActive="bg-gray-100 text-gray-900"
             class="text-gray-500 hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
            Expenses
          </a>
          <a href="/properties" 
             routerLinkActive="bg-gray-100 text-gray-900"
             class="text-gray-500 hover:text-gray-700 hover:bg-gray-50 block px-3 py-2 rounded-md text-base font-medium">
            Properties
          </a>
        </div>
      </div>
    </nav>
  `,
  // templateUrl: './header.component.html',
  // styleUrl: './header.component.css'
})
export class HeaderComponent {
  isMobileMenuOpen = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
