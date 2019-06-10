import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddEmployeeComponent } from './add-employee.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { RouterModule, Routes } from '@angular/router';
const routes: Routes = [
  { path: '', component: AddEmployeeComponent }
]
import { MaterialModule } from '../material.module';
@NgModule({
  declarations: [AddEmployeeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AddEmployeeModule { }
