import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Employee } from '../Employee';

@Component({
  selector: 'app-employee-list',
  templateUrl: './employee-list.component.html',
  styleUrls: ['./employee-list.component.css']
})
export class EmployeeListComponent {
  employees$: Observable<Employee[]>;
  filteredEmployees$: Observable<Employee[]>;
  nameFilter: string = ''; // Name filter

  showConfirmation: boolean = false; // Confirmation dialog state
  employeeToDelete: number | undefined = undefined; // ID of the employee to delete

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.filteredEmployees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend', {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
    this.filteredEmployees$ = this.employees$; // Initial state without filters
  }

  applyFilters() {
    this.filteredEmployees$ = this.employees$.pipe(
      map(employees =>
        employees.filter(e =>
          (`${e.lastName}, ${e.firstName}`.toLowerCase().includes(this.nameFilter.toLowerCase()))
        )
      )
    );
  }

  showDetails(id: number | undefined) {
    console.log('Show details for ID:', id);
  }

  editEmployee(id: number | undefined) {
    console.log('Edit employee with ID:', id);
  }

  deleteEmployee(id: number | undefined) {
    this.showConfirmation = true; // Show the confirmation dialog
    this.employeeToDelete = id; // Store the employee's ID
  }

  confirmDelete(): void {
    if (this.employeeToDelete !== undefined) {
      console.log(this.employeeToDelete + "employee")
      this.http.delete(`/employees/${this.employeeToDelete}`).subscribe({
        next: () => {
          console.log('Employee deleted successfully:', this.employeeToDelete);
          this.fetchData(); // Refresh the employee list
        },
        error: (error) => {
          console.error('Error deleting employee:', error);
        },
        complete: () => {
          console.log('Delete request completed.');
        }
      });

      // Reset the state
      this.employeeToDelete = undefined;
      this.showConfirmation = false;
    }
  }


  cancelDelete(): void {
    this.showConfirmation = false; // Close the confirmation dialog
    this.employeeToDelete = undefined; // Reset the stored ID
  }

  createNewUser() {
    console.log('Create new user clicked');
  }
}
