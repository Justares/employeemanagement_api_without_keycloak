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
    this.filteredEmployees$ = this.employees$; // Initial ohne Filter
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
      // Wenn die Eingabe ungültig ist (keine positive Zahl), zeige keine Benutzer an
      this.errorMessage = 'Ungültige ID. Bitte geben Sie eine positive Zahl ein.'; // Fehlermeldung setzen
      this.filteredEmployees$ = of([]);
    }
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
    console.log('Create new user clicked');
  }
}
