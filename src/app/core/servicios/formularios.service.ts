import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Registro } from '../interface/registro.interface';
import { Observable } from 'rxjs';
import { login } from '../interface/login.interface';

@Injectable({
  providedIn: 'root'
})
export class FormulariosService {

  private apiUrl = 'http://localhost:3000/api';
  constructor(private http:HttpClient) { }

  registroService(registro:Registro): Observable<any>{
    return this.http.post(`${this.apiUrl}/registro`,registro)
  }

  loginService(login:login):Observable<any>{
    return this.http.post(`${this.apiUrl}/login`,login)
  }
}
