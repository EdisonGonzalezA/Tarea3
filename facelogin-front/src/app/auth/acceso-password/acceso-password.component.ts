import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { NgForm } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

const URL = environment.urlServer;


@Component({
  selector: 'app-acceso-password',
  templateUrl: './acceso-password.component.html',
  styleUrls: ['./acceso-password.component.scss']
})
export class AccesoPasswordComponent implements OnInit {

  idUser:any;
  image:any;
  imageUser:any;

  usuario={
    password:''
  }

  constructor(private usuarioSvc: UsuarioService, private router:Router) { }

  ngOnInit(){

    this.obtenerImg();
  }

  obtenerImg(){

    this.idUser = localStorage.getItem('id');

    this.usuarioSvc.usuarioData(this.idUser).subscribe(res=>{

      this.image = res;
      this.imageUser = `${URL}/${this.image.imagen}`;
    });
  }
  accesoPassword(forma: NgForm){

    this.idUser = localStorage.getItem('id');

    this.usuarioSvc.login(this.idUser, forma.value.password).subscribe(res=>{

      localStorage.removeItem('usuario');
      localStorage.setItem('user', 'reautorizado');
      this.router.navigateByUrl('/upload-files');
    },(err)=>{
      Swal.fire('ERROR', err.error.message, 'error')
    });
  } 

  btnVolver(){

    localStorage.removeItem('id');
    localStorage.removeItem('usuario');

    this.router.navigateByUrl('/');
  }

}
