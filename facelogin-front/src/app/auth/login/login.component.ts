import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as faceapi from 'face-api.js';
import { Imagenes } from 'src/app/interfaces/images-interface';
import { ProcessFaceService } from 'src/app/services/process-face.service';
import { environment } from 'src/environments/environment';

const URL = environment.urlServer;


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('videoContainer',{static:true}) videoContainer!:ElementRef;
  @ViewChild('myCanvas',{static:true}) myCanvas!:ElementRef;

  imagenes:any=[];
  public context!: CanvasRenderingContext2D;

  constructor(private http:HttpClient, private processFacesSvc:ProcessFaceService) { }

  ngOnInit(): void {
  }

  detectar(){
    this.main();
  }

  removeVideo(){
    location.reload();
  }

  main = async()=>{

    this.context = this.myCanvas.nativeElement.getContext('2d');
    var video = await navigator.mediaDevices.getUserMedia({video:true, audio:false});

    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');

    this.imagesLista();

    this.videoContainer.nativeElement.srcObject = video;

  const reDraw = async()=>{
   
      this.context.drawImage(this.videoContainer.nativeElement, 0, 0, 640, 480);

      requestAnimationFrame(reDraw);
  }


  const processFace = async()=>{

    const detection = await faceapi.detectSingleFace(this.myCanvas.nativeElement, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()
        console.log(detection);
        if (typeof detection === 'undefined') return;

        this.processFacesSvc.descriptor(detection);

  }

  
  setInterval(processFace, 2000);
  requestAnimationFrame(reDraw);
 }

 imagesLista(){
  this.http.get<any>(`${URL}/upload`).subscribe((res:Imagenes)=>{
    this.imagenes = res;
    //console.log(this.imagenes)
    this.imagenes.forEach((imagen:any)=>{

      const imageElement = document.createElement('img');
      imageElement.src = `${URL}/${imagen.imagen}`;
      imageElement.crossOrigin = 'anonymous';

      this.processFacesSvc.processFace(imageElement, imagen.id);

      

    })
    
  })
}
}
