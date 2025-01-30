import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BackService {

  baserUrl: string = '';

  constructor(private http: HttpClient) { }

  getFromToken(formData: any) {
    this.baserUrl = '[midominio.com]/formtoken';
    return this.http.post(this.baserUrl, formData);
  }

  validacion( paymentData: any) {
    this.baserUrl = '[midominio.com]/validate';
    let dic = {
      'kr-answer': paymentData.rawClientAnswer,
      'kr-hash': paymentData.hash,
    }
    return this.http.post(this.baserUrl, dic);
  }

}
