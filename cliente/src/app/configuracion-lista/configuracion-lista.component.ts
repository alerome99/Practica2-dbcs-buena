import { Component, OnInit } from '@angular/core';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';
import { Configuracionpc } from '../shared/app.model';
import { DataService } from '../shared/data.service';

@Component({
  selector: 'app-configuracion-lista',
  templateUrl: './configuracion-lista.component.html',
  styleUrls: ['./configuracion-lista.component.css'],
})
export class ConfiguracionListaComponent implements OnInit {
  Configuraciones: Configuracionpc[];
  mostrarMensaje: boolean;
  mensaje: string;

  constructor(
    private clienteApiRest: ClienteApiRestService,
    private datos: DataService
  ) {}

  ngOnInit() {
    console.log('Dentro de la funcion ngOnInit de lista configuraciones');

    this.datos.mostrarMensajeActual.subscribe(
      (valor) => (this.mostrarMensaje = valor)
    );
    console.log('Valor actual de si mostrar mensaje: ' + this.mostrarMensaje);

    this.datos.mensajeActual.subscribe((valor) => (this.mensaje = valor));
    console.log('Valor actual del mensaje: ' + this.mensaje);
    this.clienteApiRest.getAllConfiguraciones().subscribe(
      (resp: Configuracionpc[]) => {
      },
      (err) => {
        console.log('Error al traer la lista: ' + err.message);
        throw err;
      }
    );
    this.getConfiguracion_AccesoResponse();
  }
  getConfiguracion_AccesoResponse() {
    this.clienteApiRest.getConfiguraciones_AccesoResponse().subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.Configuraciones = resp.body; // se accede al cuerpo de la respuesta
          console.log('Lista traida con exito');
        } else {
          this.mensaje = 'Error al acceder a los datos';
          this.mostrarMensaje = true;
        }
      },
      (err) => {
        console.log('Error al traer la lista: ' + err.message);
        throw err;
      }
    );
  }
  
  borrar(id: Number) {
    this.clienteApiRest.borrarConfiguracion(id.toString()).subscribe(
      (resp) => {
        if (resp.status < 400) {
          this.mostrarMensaje = true; 
          console.log('Configuracion eliminada con exito'); 
          this.getConfiguracion_AccesoResponse(); 
        } else {
          this.mostrarMensaje = true;
          console.log('Error al eliminar registro');
        }
      },
      (err) => {
        console.log('Error al borrar: ' + err.message);
        throw err;
      }
    );
  }

  cerrarSesion(){
    this.clienteApiRest.cerrarSesion();
    console.log('sesion cerrado con exito');
  }
}
