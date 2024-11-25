import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
// import { PropertyOverviewComponent } from './components/property-overview/property-overview.component';
// import { FinancialSummaryComponent } from './components/financial-summary/financial-summary.component';
// import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
// import { MaintenanceOverviewComponent } from './components/maintenance-overview/maintenance-overview.component';
import { DashboardResolver } from './resolvers/dashboard.resolver';
// import { PropertyResolver } from './resolvers/property.resolver';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    resolve: {
      dashboardData: DashboardResolver
    },
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
      // {
      //   path: 'overview',
      //   component: PropertyOverviewComponent,
      //   data: { title: 'Dashboard Overview' }
      // },
      // {
      //   path: 'financials',
      //   component: FinancialSummaryComponent,
      //   data: { title: 'Financial Summary' }
      // },
      // {
      //   path: 'bookings',
      //   component: BookingSummaryComponent,
      //   data: { title: 'Booking Summary' }
      // },
      // {
      //   path: 'maintenance',
      //   component: MaintenanceOverviewComponent,
      //   data: { title: 'Maintenance Overview' }
      // },
      // {
      //   path: 'property/:id',
      //   component: PropertyOverviewComponent,
      //   resolve: {
      //     property: PropertyResolver
      //   },
      //   data: { title: 'Property Details' }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }