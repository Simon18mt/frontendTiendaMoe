import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { productoData } from '../interface/productoData.interface';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private apiUrl = 'http://localhost:3000/api';
  constructor(private http:HttpClient) { }

  agregarProducto(idUser:string, productoData: productoData):Observable<any>{
    return this.http.put(`${this.apiUrl}/carritoProductos`,{idUser,productoData})
  }

  obtenerCarrito(idUser: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/obtenerCarrito`, { 
      params: new HttpParams().set('idUser', idUser) // Ahora coincide con el API route
    });
  }

  // 🔹 Actualiza la cantidad del producto en el carrito si ya existe
  actualizarProducto(idUser: string, productoData: productoData): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizaSuma`, { idUser, productoData });
  }

  // RESTA
  actualizarProductoResta(idUser: string, productoData: productoData): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizaResta`, { idUser, productoData });
  }


  eliminarCarrito(idUser:string, idCarrito:string): Observable<any>{
    return this.http.delete(`${this.apiUrl}/eliminarCarrito`,{
      body:{idUser,idCarrito}
    })
  }

 
}
