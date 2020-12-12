import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule }   from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { AddNuevaComponent } from './add-nueva/add-nueva.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ClienteApiRestService } from './shared/cliente-api-rest.service';
import { DataService } from './shared/data.service';
import { HttpClientModule } from '@angular/common/http';
import { ConfiguracionListaComponent } from './configuracion-lista/configuracion-lista.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AddNuevaComponent,
    ConfiguracionListaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    MatTableModule,
    AppRoutingModule,
    FormsModule,
    MatCheckboxModule,
    BrowserAnimationsModule
  ],
  providers: [
    ClienteApiRestService,
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
