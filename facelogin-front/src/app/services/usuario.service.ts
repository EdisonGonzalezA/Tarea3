import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Usuario } from '../interfaces/usuario.interface';

//http://localhost:3000
const URL = environment.urlServer;

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http:HttpClient) { }

  usuarioData(id:string){

    return this.http.get(`${URL}/imagen/${id}`);
  }

  login(id:string,formData:Usuario){
    
    return this.http.post(`${URL}/auth/${id}`, formData);
  }

}
