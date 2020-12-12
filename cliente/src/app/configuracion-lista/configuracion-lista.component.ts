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
    console.log('Dentro funcion ngOnInit de Listar');

    this.datos.mostrarMensajeActual.subscribe(
      (valor) => (this.mostrarMensaje = valor)
    );
    console.log('Valor actual de si mostrar mensaje: ' + this.mostrarMensaje);

    this.datos.mensajeActual.subscribe((valor) => (this.mensaje = valor));
    console.log('Valor actual del mensaje: ' + this.mensaje);
    this.clienteApiRest.getAllConfiguraciones().subscribe(
      (resp: Configuracionpc[]) => {
        console.log('datos: ' + resp);
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
        console.log('Cabeceras: ' + resp.headers.keys());
        console.log('Status: ' + resp.status);
        if (resp.status < 400) {
          this.Configuraciones = resp.body; // se accede al cuerpo de la respuesta
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
          this.mostrarMensaje = true; // actualizamos variable compartida
          this.mensaje = 'Registro borrado con exito'; // actualizamos variable compartida
          this.getConfiguracion_AccesoResponse(); //Actualizamos la lista de vinos en la vista
        } else {
          this.mostrarMensaje = true;
          this.mensaje = 'Error al eliminar registro';
        }
      },
      (err) => {
        console.log('Error al borrar: ' + err.message);
        throw err;
      }
    );
  }
}
