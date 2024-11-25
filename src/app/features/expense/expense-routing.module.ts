import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExpensesComponent } from '../../components/expenses/expenses.component';
// import { ExpenseListComponent } from './expense-list/expense-list.component';
// import { ExpenseDetailsComponent } from './expense-details/expense-details.component';
// import { ExpenseFormComponent } from './expense-form/expense-form.component';

const routes: Routes = [
  {
    path: '',
    component: ExpensesComponent
  }
  // {
  //   path: '',
  //   component: ExpenseListComponent
  // },
  // {
  //   path: 'new',
  //   component: ExpenseFormComponent
  // },
  // {
  //   path: ':id',
  //   component: ExpenseDetailsComponent
  // },
  // {
  //   path: ':id/edit',
  //   component: ExpenseFormComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpenseRoutingModule { }
