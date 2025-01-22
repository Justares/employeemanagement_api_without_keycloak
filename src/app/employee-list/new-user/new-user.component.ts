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

  // Define available skills
  availableSkills = [
    { id: 1, name: 'Java' },
    { id: 2, name: 'Python' },
    { id: 3, name: 'JavaScript' },
    { id: 4, name: 'Angular' },
    { id: 5, name: 'Spring' }
  ];

  constructor(private http: HttpClient) {}

  onSubmit() {
    const employeeData = {
      lastName: this.newEmployee.lastName,
      firstName: this.newEmployee.firstName,
      street: this.newEmployee.street,
      postcode: this.newEmployee.postcode,
      city: this.newEmployee.city,
      phone: this.newEmployee.phone,
      skillSet: this.newEmployee.skillSet || []
    };

    console.log('Sending data to backend:', employeeData);

    // Changed endpoint from '/employees' back to '/backend'
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
