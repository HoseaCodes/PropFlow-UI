import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { PropertyListComponent } from './components/property-list/property-list.component';
import { PropertyDetailsComponent } from './components/property-details/property-details.component';
import { BookingsComponent } from './components/bookings/bookings.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { HeaderComponent } from './core/layout/header/header.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { CommonModule } from '@angular/common';
import { TransactionsComponent } from './components/transactions/transactions.component';
import { ConfirmDialogComponent } from './shared/components/confirm-dialog/confirm-dialog.component';
import { SignInComponent } from './components/auth/sign-in.component';
import { SignUpComponent } from './components/auth/sign-up.component';
import { routes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    PropertyListComponent,
    PropertyDetailsComponent,
    BookingsComponent,
    TransactionsComponent,
    SignInComponent,
    SignUpComponent,
    ConfirmDialogComponent,
    DashboardComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(
      routes
    )
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }