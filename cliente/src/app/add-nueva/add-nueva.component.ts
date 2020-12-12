import { Component, OnInit, SystemJsNgModuleLoader } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Configuracionpc } from '../shared/app.model';
import { DataService } from '../shared/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';

/**
 * @title Basic use of `<table mat-table>`
 */
@Component({
  selector: 'app-add-nueva',
  templateUrl: './add-nueva.component.html',
  styleUrls: ['./add-nueva.component.css'],
})
export class AddNuevaComponent implements OnInit {
  constructor(
    private clienteApiRest: ClienteApiRestService,
    private datos: DataService,
    private ruta: ActivatedRoute,
    private route: Router
  ) {}

  ngOnInit(): void {
    console.log('En editar-vino');
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
          console.log('Error al traer el vino: ' + err.message);
          throw err;
        }
      );
    }
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
  configuracion = this.conf as Configuracionpc;
  idconfiguracion: String;
  operacion: String;
  onSubmit() {
    console.log('Enviado formulario');
    console.log('esta es la conf' + this.configuracion.capacidaddd);
    if (this.idconfiguracion) {
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
      console.log(this.idconfiguracion);
      this.clienteApiRest.addConfiguracion(this.configuracion).subscribe(
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

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
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
