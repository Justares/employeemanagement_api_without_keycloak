import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Employee } from '../../Employee';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  submitting = false;

  newEmployee = new Employee(
    undefined, // id
    '', // lastName
    '', // firstName
    '', // street
    '', // postcode
    '', // city
    '', // phone
    [] // skillSet
  );

  // Available skills (we keep the names for display purposes)
  availableSkills = [
    { id: 7, skill: 'Java' },
    { id: 8, skill: 'Angular' }
  ];

  constructor(private http: HttpClient) {}

  onSubmit() {
    if (this.submitting) return;
    this.submitting = true;

    // Create request body exactly as Swagger shows
    const employeeData = {
      lastName: this.newEmployee.lastName,
      firstName: this.newEmployee.firstName,
      street: this.newEmployee.street,
      postcode: this.newEmployee.postcode,
      city: this.newEmployee.city,
      phone: this.newEmployee.phone,
      skillSet: this.newEmployee.skillSet  // This is already an array of numbers
    };

    console.log('Sending data to backend:', employeeData);

    this.http.post<Employee>('/backend', employeeData, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    }).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.submitting = false;
        this.closeModal.emit(true);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        console.error('Error details:', error.error);
        this.submitting = false;
      }
    });
  }

  onCancel() {
    this.closeModal.emit(false);
  }
}
