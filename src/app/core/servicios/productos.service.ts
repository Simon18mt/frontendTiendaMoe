import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { producto } from "../interface/producto.interface"
import { productoData } from '../interface/productoData.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private apiUrl = 'http://localhost:3000/api';
  constructor(private http:HttpClient) { }

  agregarProducto(producto:producto):Observable<any>{
    return this.http.post(`${this.apiUrl}/agregarProductos`,producto)
  }

  // Obtener los productos
  obtenerProductos(): Observable<any> {
    // Crear los parámetros de la solicitud GET
    // const params = new HttpParams().set('userId', userId);
    return this.http.get(`${this.apiUrl}/obtenerProductos`);
  }

  // Eliminar los productos
  eliminarProductos(idProducto: string):Observable<any>{
    return this.http.delete(`${this.apiUrl}/eliminarProductos`,{ body: {idProducto}});
  }

  //Editar productos
  editarProducto(id:string, productoData:productoData):Observable<any>{
    return this.http.put(`${this.apiUrl}/editarProductos`,{id,productoData})
  }
}
