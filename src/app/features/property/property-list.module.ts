import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PropertyListComponent } from '../../components/property-list/property-list.component';
import { SharedModule } from '../../shared/shared/shared.module';

@NgModule({
  declarations: [
    PropertyListComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    SharedModule
  ],
  exports: [
    PropertyListComponent
  ]
})
export class PropertyListModule { }
