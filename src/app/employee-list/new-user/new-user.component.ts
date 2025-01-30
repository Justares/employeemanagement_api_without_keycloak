import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../../Employee';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
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

  onSubmit(form: NgForm) {
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
        if (error.error && error.error.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'An error occurred while creating the user.';
        }
      }
    });
  }

  onCancel() {
    this.closeModal.emit(false);
  }

  hasError(form: NgForm, fieldName: string): boolean {
    const field = form.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.submitted));
  }
}
