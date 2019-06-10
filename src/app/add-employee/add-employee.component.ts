import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent implements OnInit {
  employeeForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private toastr: ToastrService
  ) {
    
   }

  employee_name = new FormControl('', [Validators.required]);
  department = new FormControl('', [Validators.required]);
  joining_date = new FormControl('', [Validators.required]);
  age = new FormControl('', [Validators.required]);
  location = new FormControl('', [Validators.required]);
  salary = new FormControl('', [Validators.required]);
  gender = new FormControl('Male', [Validators.required]);
  ngOnInit() {
    this.employeeForm = this.fb.group({
      employee_name: this.employee_name,
      department: this.department,
      joining_date: this.joining_date,
      age: this.age,
      location: this.location,
      salary: this.salary,
      gender: this.gender
    })
  }

  getErrorName() {
    return this.employee_name.hasError('required') ? 'Employee Name Required': '';
  }
  getErrorDepartment() {
    return this.department.hasError('required') ? 'Department is Required': '';
  }
  getErrorJoiningDate() {
    return this.joining_date.hasError('required') ? 'Joining date is Required': '';
  }
  getErrorAge() {
    return this.age.hasError('required') ? 'Age is Required': '';
  }
  getErrorLocation() {
    return this.location.hasError('required') ? 'Location is Required': '';
  }
  getErrorSalary() {
    return this.salary.hasError('required') ? 'Salary is Required': '';
  }
  getErrorGender() {
    return this.gender.hasError('required') ? 'Gender is Required': '';
  }

  postService(params, url) {
    this.api.postServiceCall(params, url).subscribe(
      res => {
        this.toastr.success('Employee add successfully.', 'Success' );
        this.employeeForm.reset();
        this.employeeForm.patchValue({
          gender: 'Male'
        })
      },
      error => {
        console.log(error);
        this.toastr.error('Something went wrong, try again.', 'Error');
      }
    )
  }

  submitForm() {
    if (this.employeeForm.valid) {
      const params = {
        employee_name: this.employeeForm.value.employee_name,
        department: this.employeeForm.value.department,
        joining_date: this.employeeForm.value.joining_date,
        age: this.employeeForm.value.age,
        location: this.employeeForm.value.location,
        salary: this.employeeForm.value.salary,
        gender: this.employeeForm.value.gender
      }
      console.log(params);
      this.postService(params, 'addEmployeeData');
    }
  }

}
