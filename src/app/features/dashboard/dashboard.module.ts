import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from '../../components/dashboard/dashboard.component';
// import { PropertyOverviewComponent } from './components/property-overview/property-overview.component';
// import { FinancialSummaryComponent } from './components/financial-summary/financial-summary.component';
// import { BookingSummaryComponent } from './components/booking-summary/booking-summary.component';
// import { MaintenanceOverviewComponent } from './components/maintenance-overview/maintenance-overview.component';
import { SharedModule } from '../../shared/shared/shared.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';

@NgModule({
  declarations: [
    DashboardComponent,
    // PropertyOverviewComponent,
    // FinancialSummaryComponent,
    // BookingSummaryComponent,
    // MaintenanceOverviewComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    NgxChartsModule
  ]
})
export class DashboardModule { }