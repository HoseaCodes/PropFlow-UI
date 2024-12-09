import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { HomeComponent } from './components/home/home.component';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { SignInComponent } from './components/auth/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up.component';
import { AuthGuard } from './core/guards/auth.guard';
// import { PropertyDetailsComponent } from './components/property-details/property-details.component';
// import { authGuard } from './core/guards/auth.guard';
// import { adminGuard } from './core/guards/admin.guard';

// export const routes: Routes = [
// //   {
// //     path: 'dashboard',
// //     loadChildren: () => import('./features/dashboard/dashboard-routing.module')
// //       .then(m => m.DashboardRoutingModule),
// //     // canActivate: [authGuard],
// //     title: 'Dashboard'
// //   },
// //   {
// //     path: 'properties',
// //     loadChildren: () => import('./features/property/property-routing.module')
// //       .then(m => m.PropertyRoutingModule),
// //     // canActivate: [authGuard],
// //     title: 'Properties'
// //   },
// //   {
// //     path: 'bookings',
// //     loadChildren: () => import('./features/bookings/bookings.module')
// //       .then(m => m.BookingsModule),
// //     // canActivate: [authGuard],
// //     title: 'Bookings'
// //   },
// //   {
// //     path: 'expenses',
// //     loadChildren: () => import('./features/expense/expense-routing.module')
// //       .then(m => m.ExpenseRoutingModule),
// //     // canActivate: [authGuard],
// //     title: 'Expenses'
// //   },
// //   {
// //     path: 'calendar',
// //     loadChildren: () => import('./features/calendar/calendar.routes')
// //       .then(m => m.CALENDAR_ROUTES),
// //     canActivate: [authGuard],
// //     title: 'Calendar'
// //   },
// //   {
// //     path: 'maintenance',
// //     loadChildren: () => import('./features/maintenance/maintenance.routes')
// //       .then(m => m.MAINTENANCE_ROUTES),
// //     canActivate: [authGuard],
// //     title: 'Maintenance'
// //   },
// //   {
// //     path: 'reports',
// //     loadChildren: () => import('./features/reports/reports.routes')
// //       .then(m => m.REPORTS_ROUTES),
// //     canActivate: [authGuard],
// //     title: 'Reports'
// //   },
// //   {
// //     path: 'settings',
// //     loadChildren: () => import('./features/settings/settings.routes')
// //       .then(m => m.SETTINGS_ROUTES),
// //     canActivate: [authGuard],
// //     title: 'Settings'
// //   },
// //   {
// //     path: 'admin',
// //     loadChildren: () => import('./features/admin/admin.routes')
// //       .then(m => m.ADMIN_ROUTES),
// //     canActivate: [authGuard, adminGuard],
// //     title: 'Admin'
// //   },
// //   {
// //     path: 'auth',
// //     loadChildren: () => import('./features/auth/auth.routes')
// //       .then(m => m.AUTH_ROUTES),
// //     title: 'Authentication'
// //   },
// //   {
// //     path: '404',
// //     loadComponent: () => import('./shared/components/not-found/not-found.component')
// //       .then(m => m.NotFoundComponent),
// //     title: 'Page Not Found'
// //   },
// //   {
// //     path: '**',
// //     redirectTo: '404'
// //   }
// ];
export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'properties', component: PropertyListComponent, canActivate: [AuthGuard] },
  // { path: 'properties/:id', component: PropertyDetailsComponent, canActivate: [AuthGuard] },
  { path: 'bookings', component: BookingsComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionsComponent, canActivate: [AuthGuard] },
  { path: 'signin', component: SignInComponent },
  { path: 'signup', component: SignUpComponent },
  { path: 'logout', redirectTo: '/signin', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' } // Wildcard route for handling undefined routes
];

