import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Configuracionpc, Conversion, Pais, Usuario } from '../shared/app.model';
import { DataService } from '../shared/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';
import { HttpClient } from '@angular/common/http';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-add-nueva',
  templateUrl: './add-nueva.component.html',
  styleUrls: ['./add-nueva.component.css'],
})
export class AddNuevaComponent implements OnInit {
  private data:any = [];
  private verbose:number;
  mensajeError: string = "";
  constructor(
    private clienteApiRest: ClienteApiRestService,
    private datos: DataService,
    private ruta: ActivatedRoute,
    private httpClient: HttpClient,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.verbose = 0;
    this.operacion = this.ruta.snapshot.url[
      this.ruta.snapshot.url.length - 1
    ].path;
    if (this.operacion == 'editar') {
      console.log('En Editar');
      this.ruta.paramMap.subscribe(
        (params) => {
          this.idconfiguracion = params.get('id');
        },
        (err) => console.log('Error al leer id para editar: ' + err)
      );
      console.log('Id: ' + this.idconfiguracion);
      this.clienteApiRest.getConfiguracion(this.idconfiguracion).subscribe(
        (resp) => {
          this.configuracion = resp.body;
        },
        (err) => {
          console.log('Error al traer la configuracion: ' + err.message);
          throw err;
        }
      );
    }else{
      console.log('En añadir');
    }
    this.getPais();
  }

  displayedColumns = ['select', 'tipo', 'marca', 'modelo'];
  dataSource = new MatTableDataSource<Element>(ELEMENT_DATA);
  selection = new SelectionModel<Element>(true, []);

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  conf = {
    idconfiguracion: 0,
    tipocpu: '',
    velocidadcpu: 0,
    capacidadram: 0,
    capacidaddd: 0,
    velocidadtarjetagrafica: 0,
    memoriatarjetagrafica: 0,
    precio: 0.0
  };

  f = {
    dineroconvertido: 0
  }

  p = {
    pais:''
  }

  conversion = this.f as Conversion;
  pa = this.p as Pais;
  configuracion = this.conf as Configuracionpc;
  idconfiguracion: String;
  operacion: String;
  onSubmit() {
    console.log('Enviado formulario');
    if (this.idconfiguracion) {
      if(this.conversion.dineroconvertido!=0){
        this.configuracion.precio = this.conversion.dineroconvertido; 
      }    
      this.clienteApiRest
        .modificarConfiguracion(
          String(this.configuracion.idconfiguracion),
          this.configuracion
        )
        .subscribe(
          (resp) => {
            if (resp.status < 400) {
              this.datos.cambiarMostrarMensaje(true);
              this.datos.cambiarMensaje('Configuracion modificada con exito');
              console.log(this.datos.mostrarMensajeActual);
            } else {
              this.datos.cambiarMostrarMensaje(true);
              this.datos.cambiarMensaje('Error al modificar configuracion');
              this.mensajeError = "Error al modificar configuracion";
              console.log(this.datos.mostrarMensajeActual);
            }
            this.route.navigate(['configuraciones']); 
          },
          (err) => {
            this.mensajeError = "Error al modificar configuracion";
            console.log('Error editar: ' + err.message);
            throw err;
          }
        );
    } else {  
      this.configuracion.precio = this.conversion.dineroconvertido;    
      this.clienteApiRest.addConfiguracion(this.configuracion).subscribe(
        (resp) => {
          if (resp.status < 400) {
            this.datos.cambiarMostrarMensaje(true);
            this.datos.cambiarMensaje('Configuracion añadida con exito');
            console.log(this.datos.mostrarMensajeActual);
          } else {
            this.datos.cambiarMostrarMensaje(true);
            this.datos.cambiarMensaje('Error al añadir la configuracion');
            this.mensajeError="Error al añadir la configuracion";
            this.configuracion.precio = 0;
            console.log(this.datos.mostrarMensajeActual);
          }
          this.route.navigate(['configuraciones']);
        },
        (err) => {
          this.mensajeError="Error al añadir la configuracion";
          console.log('Error al añadir: ' + err.message);
          throw err;
        }
      );
    }
  }

  getPais(){
    this.clienteApiRest.getPais().subscribe(
      (resp) => {
        this.pa.pais = JSON.parse(JSON.stringify(resp.body)).pais;
        console.log('Pais traido con exito: ' + this.pa.pais);
      },
      (err) => {
        console.log('Error al traer el pais: ' + err.message);          
        throw err;
      }    
    );
    return null;
  }

  estadoIntermedio(){
    this.getCoeficiente(this.pa.pais);
  }
  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
  
  getCoeficiente(pais : String){
    let url = 'https://restcountries.eu/rest/v2/name/' + pais + '?fullText=true';
    this.httpClient.get(url).subscribe((res) => {
      this.data = res;
      var ej = JSON.parse(JSON.stringify(res));
      var currency = ej[0].currencies[0].code
      if(this.verbose==0){
        console.log('Codigo de moneda traido con exito: ' + currency);     
      }      
      if(currency==='EUR'){
        this.conversion.dineroconvertido = this.configuracion.precio;
        this.verbose = 1;  
      }else{
        fetch(
          'https://api.frankfurter.app/2020-01-01?to=' + currency
        )
        .then((resp) => resp.json())
        .then((data) => {
          if(this.verbose==0){
            console.log('Factor de conversion traido con exito: ' + data.rates[currency]);
          }
          this.conversion.dineroconvertido = data.rates[currency] * this.configuracion.precio;
          this.verbose = 1;
        }
        );
      }   
    });
  }

  cerrarSesion(){
    this.clienteApiRest.cerrarSesion();
  }
}

export interface Element {
  tipo: number;
  marca: string;
  modelo: string;
}

const ELEMENT_DATA: Element[] = [
  { tipo: 1, marca: 'marca 1', modelo: 'modelo 1' },
  { tipo: 2, marca: 'marca 1', modelo: 'modelo 2' },
  { tipo: 3, marca: 'marca 2', modelo: 'modelo 3' },
  { tipo: 4, marca: 'marca 5', modelo: 'modelo 4' },
  { tipo: 5, marca: 'marca 5', modelo: 'modelo 5' },
  { tipo: 6, marca: 'marca 6', modelo: 'modelo 6' },
  { tipo: 1, marca: 'marca 7', modelo: 'modelo 7' },
  { tipo: 2, marca: 'marca 5', modelo: 'modelo 8' },
  { tipo: 3, marca: 'marca 8', modelo: 'modelo 8' },
];
