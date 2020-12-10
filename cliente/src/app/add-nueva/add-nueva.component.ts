import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { Configuracionpc } from '../shared/app.model';
import { DataService } from '../shared/data.service';
import { Router,ActivatedRoute } from '@angular/router';
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
    this.ruta.paramMap.subscribe(
      params => {
        this.idconfiguracion = params.get('idconfiguracion');
      },
      err => console.log("Error al leer id para editar: " + err)
    )    
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
    tipocpu: '1',
    velocidadcpu: 0,
    capacidadram: 0,
    capacidaddd: 0,
    velocidadtarjetagrafica: 0,
    memoriatarjetagrafica: 0,
    precio: 0,
  };
  configuracion = this.conf as Configuracionpc;
  idconfiguracion: String; 
  onSubmit() {
    console.log('Enviado formulario');
    // Parte añadir configuracion
    this.clienteApiRest.addConfiguracion(this.configuracion).subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje('Configuracion añadida con exito');
        } else {
          this.datos.cambiarMostrarMensaje(true);
          this.datos.cambiarMensaje('Error al añadir la configuracion');
        }
        this.route.navigate(['add']);
      },
      (err) => {
        console.log('Error al añadir: ' + err.message);
        throw err;
      }
    );
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
