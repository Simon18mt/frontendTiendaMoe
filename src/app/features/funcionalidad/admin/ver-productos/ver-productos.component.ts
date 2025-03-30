import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../core/servicios/productos.service';

@Component({
  selector: 'app-ver-productos',
  standalone: false,
  templateUrl: './ver-productos.component.html',
  styleUrl: './ver-productos.component.css'
})
export class VerProductosComponent implements OnInit {

  productosListos: any[] = []; // Almacenar productos en un array

  constructor(private productosService: ProductosService) {}

  ngOnInit() {
    this.obtenerProductos();
  }

  obtenerProductos() {
    this.productosService.obtenerProductos().subscribe(
      (response) => {
        console.log(response); 
        this.productosListos = response.productos; // Guardar los productos en la lista
      },
      (error) => {
        console.error("Error al obtener productos:", error);
      }
    );
  }
}
