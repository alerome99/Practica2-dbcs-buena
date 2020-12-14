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

  getLogin(user: string, password: string): Observable<Login> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + user;
    this.usuario = user;
    return this.http.get<Login>(url, {
      headers: new HttpHeaders({
        Password: password
      })
    });
  }

  getPais(): Observable<HttpResponse<Pais>>{
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + this.usuario + '/pais';
    return this.http.get<Pais>(url, { observe: 'response' });
  }

  addConfiguracion(configuracionpc: Configuracionpc, f: Number): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + f;
    return this.http.post<Configuracionpc>(url, configuracionpc, { observe: 'response'});
  }

  modificarConfiguracion(id: String, configuracionpc: Configuracionpc, f: Number): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + id + '/' + f;
    return this.http.put<Configuracionpc>(url, configuracionpc, { observe: 'response'});
  }

  getConfiguracion(id: String): Observable<HttpResponse<Configuracionpc>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/' + id + '/conf';
    return this.http.get<Configuracionpc>(url, { observe: 'response' });
  }

  getConfiguraciones_AccesoResponse(): Observable<HttpResponse<Configuracionpc[]>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores';
    return this.http.get<Configuracionpc[]>(url, { observe: 'response' });
  }

  borrarConfiguracion(id: String): Observable<HttpResponse<any>> {
    let url = ClienteApiRestService.BASE_URI + '/ordenadores/borrar/' + id;
    return this.http.delete<any>(url, { observe: 'response'});
  }

  getAllConfiguraciones() {
    //console.log("dentro de getAllVInos");
    let url = ClienteApiRestService.BASE_URI + '/ordenadores';
    return this.http.get<Configuracionpc[]>(url);
  }

}
