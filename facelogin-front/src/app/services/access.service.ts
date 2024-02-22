import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccessService {

  auth="autorizado";

  constructor() { }

  accesoPassword(id: string){

    if(id == 'unkmown'){
      return;
    }else{
      localStorage.setItem('id',id);
      localStorage.setItem('usuario',this.auth);
      location.href='/acceso.password';
    }

  }
}
