import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TransactionsComponent } from '../../components/transactions/transactions.component';

const routes: Routes = [
  {
    path: '',
    component: TransactionsComponent
  },
  // {
  //   path: 'new',
  //   component: TransactionsFormComponent
  // },
  // {
  //   path: ':id',
  //   component: TransactionsDetailsComponent
  // },
  // {
  //   path: ':id/edit',
  //   component: TransactionsFormComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransactionsRoutingModule { }
