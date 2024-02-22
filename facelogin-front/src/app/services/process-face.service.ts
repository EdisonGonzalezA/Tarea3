import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import * as faceapi from 'face-api.js';
import { AccessService } from './access.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessFaceService {

  idImage:any
  imageDescriptor:any=[];
  faceMatcher:any;

  constructor(private http: HttpClient, private router: Router, private access5vc:AccessService) { }

  async processFace(image:any, id:string){

    await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
    await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
    await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');

    const detection = await faceapi.detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptor()
        console.log(detection);
        if (typeof detection === 'undefined') return;
  
        this.imageDescriptor.push({
          id:id,
          detection
        });

        this.faceMatcher = new faceapi.FaceMatcher(this.imageDescriptor.map((faceDescriptor:any)=>(

          new faceapi.LabeledFaceDescriptors(
          (faceDescriptor.id).toString(), [faceDescriptor.detection.descriptor])
        )))
  }

  descriptor(detection:any){

    const bestMatch = this.faceMatcher.findMatch(detection.descriptor);
    this.idImage = bestMatch.label;
    this.passwordImg(this.idImage);

  }

    passwordImg(id:string){

      this.access5vc.accesoPassword(id);
    }

}
