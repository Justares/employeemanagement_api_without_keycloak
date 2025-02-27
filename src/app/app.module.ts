import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { EmployeeListComponent } from './employee-list/employee-list.component';
import {FormsModule} from "@angular/forms";
import { ConfirmationDialogComponent } from './confirmation-dialog/confirmation-dialog.component';

import { NewUserComponent } from './employee-list/new-user/new-user.component';



@NgModule({
  declarations: [
    AppComponent,
    EmployeeListComponent,
    ConfirmationDialogComponent,
    NewUserComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
