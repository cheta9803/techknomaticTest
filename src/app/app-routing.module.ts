import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: 'employees',
    loadChildren: './employees/employees.module#EmployeesModule'
  },
  {
    path: 'add-employee',
    loadChildren: './add-employee/add-employee.module#AddEmployeeModule'
  },
  { path: '', redirectTo: '/employees', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
