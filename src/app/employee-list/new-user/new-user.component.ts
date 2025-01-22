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

  // Updated skill options to match valid backend values
  availableSkills = [
    { id: 1, name: 'Java' },
    { id: 2, name: 'Python' },
    { id: 3, name: 'JavaScript' }
  ];

  constructor(private http: HttpClient) {}

  onSubmit() {
    // Ensure skillSet is properly formatted
    const employeeData = {
      lastName: this.newEmployee.lastName,
      firstName: this.newEmployee.firstName,
      street: this.newEmployee.street,
      postcode: this.newEmployee.postcode,
      city: this.newEmployee.city,
      phone: this.newEmployee.phone,
      skillSet: this.newEmployee.skillSet && this.newEmployee.skillSet.length > 0
        ? this.newEmployee.skillSet.map(Number)
        : []
    };

    console.log('Sending data to backend:', employeeData);

    this.http.post<Employee>('/backend', employeeData, {
      headers: new HttpHeaders()
        .set('Content-Type', 'application/json')
    }).subscribe({
      next: (response) => {
        console.log('User created successfully:', response);
        this.closeModal.emit(true);
      },
      error: (error) => {
        console.error('Error creating user:', error);
        if (error.error) {
          console.error('Error details:', error.error);
        }
      }
    });
  }

  onCancel() {
    this.closeModal.emit(false);
  }
}
