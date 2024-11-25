import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookingsComponent } from '../../components/bookings/bookings.component';
// import { BookingListComponent } from './booking-list/booking-list.component';
// import { BookingDetailsComponent } from './booking-details/booking-details.component';
// import { BookingFormComponent } from './booking-form/booking-form.component';

const routes: Routes = [
  {
    path: '',
    component: BookingsComponent
  }
  // {
  //   path: '',
  //   component: BookingListComponent
  // },
  // {
  //   path: 'new',
  //   component: BookingFormComponent
  // },
  // {
  //   path: ':id',
  //   component: BookingDetailsComponent
  // },
  // {
  //   path: ':id/edit',
  //   component: BookingFormComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookingRoutingModule { }