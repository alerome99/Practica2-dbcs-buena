import { Component, OnInit } from '@angular/core';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';
import { ErrorM, Usuario } from '../shared/app.model';
import { DataService } from '../shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  User: Usuario ;
  mostrarMensaje: boolean ;
  mensaje: string ;
  mensajeError: string = "";

  constructor(
    private clienteApiRest: ClienteApiRestService,
    private datos: DataService,
    private route: Router
  ) {}

  ngOnInit(): void {
    console.log('Dentro funcion ngOnInit de login');
    this.datos.mostrarMensajeActual.subscribe(
      (valor) => (this.mostrarMensaje = valor)
    );
    console.log('Valor actual de si mostrar mensaje: ' + this.mostrarMensaje);

    this.datos.mensajeActual.subscribe((valor) => (this.mensaje = valor));
    console.log('Valor actual del mensaje: ' + this.mensaje);
  }
  er = {
    mensajeErr:true
  }

  error = this.er as ErrorM;
  onSubmit() {
    let nifcif = (document.getElementById('nif') as HTMLInputElement).value;
    let pass = (document.getElementById('pass') as HTMLInputElement).value;
    if(nifcif===''){
      nifcif='0';
    }
    this.clienteApiRest.getLogin(nifcif, pass).subscribe(
      resp => {
        this.route.navigate(['/configuraciones']);
        console.log('Sesion inicia de manera correcta con usuario: ' + nifcif);
      },
      err => {
        console.log('Usuario incorrecto: ' + err.message);
        this.mensajeError = "Usuario o contraseña incorrectos";
        throw err;
      }
    );
  }
}
