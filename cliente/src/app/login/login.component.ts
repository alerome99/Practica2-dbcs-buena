import { Component, OnInit } from '@angular/core';
import { ClienteApiRestService } from '../shared/cliente-api-rest.service';
import { Usuario } from '../shared/app.model';
import { DataService } from '../shared/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  User: Usuario | undefined;
  mostrarMensaje: boolean | undefined;
  mensaje: string | undefined;

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
  onSubmit() {
    let nifcif = (document.getElementById('nif') as HTMLInputElement).value;
    let pass = (document.getElementById('pass') as HTMLInputElement).value;
    this.clienteApiRest.getLogin(nifcif, pass).subscribe(
      resp => {
        //this.session.setLoggedIn(resp.nif);
        this.route.navigate(['/add']);
      },
      err => {
        if (err.status === 401) {
          console.log('Usuario incorrecto');
        }
      }
    );
  }
}
