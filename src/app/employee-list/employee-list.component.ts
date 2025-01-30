import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
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

  showNewUserModal = false;
  idFilter: string = ''; // ID-Filter
  errorMessage: string | null = null; // Fehlermeldung

  constructor(private http: HttpClient) {
    this.employees$ = of([]);
    this.filteredEmployees$ = of([]);
    this.fetchData();
  }

  fetchData() {
    this.employees$ = this.http.get<Employee[]>('http://localhost:8089/employees', {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
    this.filteredEmployees$ = this.employees$; // Initial state without filters
  }

  applyFilters() {
    const input = this.idFilter.trim();
    this.errorMessage = null; // Zurücksetzen der Fehlermeldung

    if (input === '') {
      // Wenn das Filterfeld leer ist, zeige alle Benutzer an
      this.filteredEmployees$ = this.employees$;
    } else if (!isNaN(Number(input)) && Number(input) > 0) {
      // Wenn die Eingabe eine positive Zahl ist, suchen wir nach der ID über den API-Endpunkt
      this.filteredEmployees$ = this.http.get<Employee>(`http://localhost:8089/employees/${input}`).pipe(
        map(employee => {
          if (employee) {
            return [employee]; // Wenn ein Benutzer gefunden wird, wird er in ein Array gepackt
          } else {
            this.errorMessage = 'Benutzer nicht gefunden.'; // Fehlermeldung setzen
            return []; // Leeres Array zurückgeben
          }
        }),
        catchError(() => {
          this.errorMessage = 'Benutzer nicht gefunden.'; // Fehlermeldung setzen
          return of([]); // Bei einem Fehler wird ein leeres Array zurückgegeben
        })
      );
    } else {
      // Wenn die Eingabe Buchstaben enthält, suchen wir nach dem Namen (lokal)
      this.filteredEmployees$ = this.employees$.pipe(
        map(employees => {
          const filtered = employees.filter(e =>
            (`${e.lastName}, ${e.firstName}`.toLowerCase().includes(input.toLowerCase()))
          );
          if (filtered.length === 0) {
            this.errorMessage = 'Keine Benutzer mit diesem Namen gefunden.'; // Fehlermeldung setzen
          }
          return filtered;
        })
      );
    }
  }

  mode: 'create' | 'view' | 'edit' = 'create';
  employeeId: number | undefined;

  showDetails(id: number | undefined) {
    if (id !== undefined) {
      this.employeeId = id;
      this.mode = 'view';
      this.showNewUserModal = true;
    }
  }

  editEmployee(id: number | undefined) {
    if (id !== undefined) {
      this.employeeId = id;
      this.mode = 'edit';
      this.showNewUserModal = true;
    }
  }

  deleteEmployee(id: number | undefined) {
    this.showConfirmation = true; // Show the confirmation dialog
    this.employeeToDelete = id; // Store the employee's ID
  }

  confirmDelete(): void {
    if (this.employeeToDelete !== undefined) {
      console.log(this.employeeToDelete + "employee")
      this.http.delete(`/backend/${this.employeeToDelete}`).subscribe({
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
    this.showNewUserModal = true;
  }

  handleModalClose(success: boolean) {
    this.showNewUserModal = false;
    if (success) {
      this.fetchData(); // Refresh the list if a user was created
    }
  }
}
