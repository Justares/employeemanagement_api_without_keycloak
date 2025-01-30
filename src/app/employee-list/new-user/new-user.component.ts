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
  @Input() mode: 'create' | 'view' | 'edit' = 'create'; // Default mode is 'create'
  @Input() employeeId: number | undefined; // ID of the employee to view/edit
  @Output() closeModal = new EventEmitter<boolean>();

  submitting = false;
  errorMessage: string | null = null;
  submitted = false;

  newEmployee = new Employee(
    undefined,
    '',
    '',
    '',
    '',
    '',
    '',
    []
  );

  availableSkills = [
    { id: 7, skill: 'Java' },
    { id: 8, skill: 'Angular' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    if (this.mode === 'create') {
      this.resetForm(); // Reset the form for create mode
    } else { // @ts-ignore
      if (this.mode !== 'create' && this.employeeId) {
            this.fetchEmployeeDetails(this.employeeId);
          }
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
      []
    );
  }

  fetchEmployeeDetails(id: number) {
    this.http.get<Employee>(`http://localhost:8089/employees/${id}`).subscribe({
      next: (employee) => {
        this.newEmployee = employee;
      },
      error: (error) => {
        console.error('Error fetching employee details:', error);
        this.errorMessage = 'Failed to fetch employee details.';
      }
    });
  }

  onSubmit(form: NgForm) {
    if (this.mode === 'view') return; // Do nothing in view mode

    this.submitted = true;
    this.errorMessage = null;

    if (form.invalid) {
      this.errorMessage = 'Please fill in all required fields correctly.';
      return;
    }

    if (!this.newEmployee.skillSet || this.newEmployee.skillSet.length === 0) {
      this.errorMessage = 'Please select at least one skill.';
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
      skillSet: this.newEmployee.skillSet
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
      this.http.put<Employee>(`/backend/${this.employeeId}`, employeeData, {
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
