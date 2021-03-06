import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Configuracionpc, Login, Pais, Usuario } from './app.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClienteApiRestService {

  private static readonly BASE_URI = 'http://localhost:8080/Practica2/webresources';
  private usuario : string;

  constructor(private http: HttpClient) { }

  getLogin(user: string, authorization: string): Observable<Login> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + user;
    this.usuario = user;
    return this.http.get<Login>(url, {
      headers: new HttpHeaders({
        Authorization: authorization
      })
    });
  }

  getPais(): Observable<HttpResponse<Pais>>{
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + this.usuario + '/pais';
    return this.http.get<Pais>(url, { observe: 'response' });
  }

  cerrarSesion(){
    this.usuario = null;
  }

  addConfiguracion(configuracionpc: Configuracionpc): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + 'add';
    return this.http.post<Configuracionpc>(url, configuracionpc, { observe: 'response'});
  }

  modificarConfiguracion(id: String, configuracionpc: Configuracionpc): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + id + '/editar';
    return this.http.put<Configuracionpc>(url, configuracionpc, { observe: 'response'});
  }

  getConfiguracion(id: String): Observable<HttpResponse<Configuracionpc>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + id + '/conf';
    return this.http.get<Configuracionpc>(url, { observe: 'response' });
  }

  getConfiguraciones_AccesoResponse(): Observable<HttpResponse<Configuracionpc[]>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/configuraciones';
    return this.http.get<Configuracionpc[]>(url, { observe: 'response' });
  }

  borrarConfiguracion(id: String): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/borrar/' + id;
    return this.http.delete<any>(url, { observe: 'response'});
  }

  getAllConfiguraciones() {
    //console.log("dentro de getAllVInos");
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/configuraciones';
    return this.http.get<Configuracionpc[]>(url);
  }

}
