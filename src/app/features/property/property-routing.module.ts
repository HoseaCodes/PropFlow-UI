import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyListComponent } from '../../components/property-list/property-list.component';
import { PropertyDetailsComponent } from '../../components/property-details/property-details.component';
// import { PropertyFormComponent } from './property-form/property-form.component';

const routes: Routes = [
  {
    path: '',
    component: PropertyListComponent
  },
  // {
  //   path: 'new',
  //   component: PropertyFormComponent
  // },
  {
    path: ':id',
    component: PropertyDetailsComponent
  },
  // {
  //   path: ':id/edit',
  //   component: PropertyFormComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PropertyRoutingModule { }
