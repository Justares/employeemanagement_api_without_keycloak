import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../../Employee';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
  @Input() mode: 'create' | 'view' | 'edit' = 'create';
  @Input() employeeId: number | undefined;
  @Output() closeModal = new EventEmitter<boolean>();

  submitting = false;
  errorMessage: string | null = null;
  submitted = false;
  skillSetText = '';

  newEmployee = new Employee(
    undefined,
    '',
    '',
    '',
    '',
    '',
    '',
    []  // Initialize with empty array
  );

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.mode === 'create') {
      this.resetForm();
    } else if (this.employeeId) {
      this.fetchEmployeeDetails(this.employeeId);
    }
  }

  resetForm() {
    this.newEmployee = new Employee(
      undefined,
      '',
      '',
      '',
      '',
      '',
      '',
      []  // Reset with empty array
    );
    this.skillSetText = '';
  }

  fetchEmployeeDetails(id: number) {
    this.http.get<Employee>(`/backend/${id}`).subscribe({
      next: (employee) => {
        this.newEmployee = employee;
        this.skillSetText = '';
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
        this.errorMessage = 'Failed to fetch employee details.';
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.mode === 'view') return;

    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.skillSetText.trim()) {
      this.errorMessage = 'Please enter your skill set.';
      return;
    }

    if (this.submitting) return;
    this.submitting = true;

    const employeeData = {
      lastName: this.newEmployee.lastName,
      firstName: this.newEmployee.firstName,
      street: this.newEmployee.street,
      postcode: this.newEmployee.postcode,
      city: this.newEmployee.city,
      phone: this.newEmployee.phone,
      skillSet: []  // Send empty array
    };

    if (this.mode === 'create') {
      this.http.post<Employee>('/backend', employeeData, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }).subscribe({
        next: (response) => {
          console.log('User created successfully:', response);
          this.submitting = false;
          this.closeModal.emit(true);
        },
        error: (error) => {
          console.error('Error creating user:', error);
          this.submitting = false;
          this.errorMessage = error.error?.message || 'An error occurred while creating the user.';
        }
      });
    } else if (this.mode === 'edit' && this.employeeId) {
      this.http.put<Employee>(`/employees/${this.employeeId}`, employeeData, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      }).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          this.submitting = false;
          this.closeModal.emit(true);
        },
        error: (error) => {
          console.error('Error updating user:', error);
          this.submitting = false;
          this.errorMessage = error.error?.message || 'An error occurred while updating the user.';
        }
      });
    }
  }

  onCancel() {
    this.closeModal.emit(false);
  }

  hasError(form: NgForm, fieldName: string): boolean {
    const field = form.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }

  isViewMode(): boolean {
    return this.mode === 'view';
  }

  isEditMode(): boolean {
    return this.mode === 'edit';
  }
}
