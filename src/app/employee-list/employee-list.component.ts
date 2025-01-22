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
  showNewUserModal = false;

  nameFilter: string = '';

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.filteredEmployees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('/backend', {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
    this.filteredEmployees$ = this.employees$;
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
    console.log('Delete employee with ID:', id);
  }

  createNewUser() {
    this.showNewUserModal = true;
  }

  handleModalClose(success: boolean) {
    this.showNewUserModal = false;
    if (success) {
      this.fetchData(); // Refresh the list if a user was created
    }
  }
}
