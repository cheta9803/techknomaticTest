import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmployeesComponent } from './employees.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../material.module';
import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: EmployeesComponent }
]
@NgModule({
  declarations: [EmployeesComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EmployeesModule { }
