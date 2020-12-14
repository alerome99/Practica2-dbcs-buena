import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
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
  constructor(
    private clienteApiRest: ClienteApiRestService,
    private datos: DataService,
    private ruta: ActivatedRoute,
    private httpClient: HttpClient,
    private route: Router
  ) {}

  ngOnInit(): void {
    console.log('En editar');
    console.log(this.ruta.snapshot.url[this.ruta.snapshot.url.length - 1].path);
    this.operacion = this.ruta.snapshot.url[
      this.ruta.snapshot.url.length - 1
    ].path; // Operacion: ultimo string de la URL
    if (this.operacion == 'editar') {
      // Si la operacion es editar se captura el id del registro y se trae el json con el vino
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
    precio: 0.0,
  };

  f = {
    factor: 0
  }

  user = {
    nifcif:'',
    nombre:'',
    direccionpostal:'',
    ciudad:'',
    pais:'',
    direccionelectronica:'',
    telefono:'',
    password:''
  }

  p = {
    pais:''
  }

  conversion = this.f as Conversion;
  pa = this.p as Pais;
  usuario = this.user as Usuario;
  configuracion = this.conf as Configuracionpc;
  idconfiguracion: String;
  operacion: String;
  onSubmit() {   
    console.log('Enviado formulario');
    if (this.idconfiguracion) {
      this.clienteApiRest
        .modificarConfiguracion(
          String(this.configuracion.idconfiguracion),
          this.configuracion, Number(this.conversion.factor)
        )
        .subscribe(
          (resp) => {
            if (resp.status < 400) {
              this.datos.cambiarMostrarMensaje(true);
              this.datos.cambiarMensaje('Configuracion modificada con exito');
            } else {
              this.datos.cambiarMostrarMensaje(true);
              this.datos.cambiarMensaje('Error al modificar configuracion');
            }
            this.route.navigate(['configuraciones']); 
          },
          (err) => {
            console.log('Error editar: ' + err.message);
            throw err;
          }
        );
    } else {
      console.log("cambio " + this.pa.pais);
      console.log("cambio2 " + this.configuracion.precio);
      console.log("cambio3 " + this.conversion.factor);
      
      this.clienteApiRest.addConfiguracion(this.configuracion, Number(this.conversion.factor)).subscribe(
        (resp) => {
          if (resp.status < 400) {
            this.datos.cambiarMostrarMensaje(true);
            this.datos.cambiarMensaje('Configuracion añadida con exito');
          } else {
            this.datos.cambiarMostrarMensaje(true);
            this.datos.cambiarMensaje('Error al añadir la configuracion');
          }
          this.route.navigate(['configuraciones']);
        },
        (err) => {
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
        this.getCoeficiente(this.pa.pais);
      },
      (err) => {
        console.log('Error al traer el pais: ' + err.message);          
        throw err;
      }    
    );
    return null;
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
      console.log(ej[0].currencies[0].code);
      var currency = ej[0].currencies[0].code;

      fetch(
        'https://api.frankfurter.app/latest?amount=10&from=' +
          currency +
          '&to=USD'
      )
        .then((resp) => resp.json())
        .then((data) => {
          this.conversion.factor = data.rates.USD/10;
          console.log("dwdwqdwqdwqdwqdwqdwqdwqdwqdqwd" + this.conversion.factor);
        }
        );
         
    });
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
