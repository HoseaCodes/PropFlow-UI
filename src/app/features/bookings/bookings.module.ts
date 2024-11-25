import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../shared/shared/shared.module';
import { BookingsComponent } from '../../components/bookings/bookings.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: BookingsComponent }
    ]),
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    SharedModule,
    BookingsComponent
  ]
})
export class BookingsModule { }