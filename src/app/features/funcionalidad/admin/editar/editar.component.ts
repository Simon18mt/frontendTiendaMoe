import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductosService } from '../../../../core/servicios/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar',
  standalone: false,
  templateUrl: './editar.component.html',
  styleUrl: './editar.component.css'
})
export class EditarComponent implements OnInit {

  myForm: FormGroup;
  productoSeleccionado: any | null = null; // Producto que se va a editar
  productosListos: any[] = []; // Lista de productos
  constructor(
    private productosService:ProductosService
  ){
    this.myForm = new FormGroup({
       //NOMBRE DEL PRODUCTO
                  nombre: new FormControl('', [
                    Validators.required,
                    this.noWhitespaceValidator,
                  ]),
                  // PRECIO DEL PRODUCTO (debe ser un número, sin `noWhitespaceValidator`)
                  precio: new FormControl('', [
                    Validators.required,
                    Validators.min(0.01), // Para evitar precios negativos o 0
                    ]),
                  // CANTIDAD DEL PRODUCTO (debe ser un número, sin `noWhitespaceValidator`)
                  cantidad: new FormControl('', [
                    Validators.required,
                    Validators.min(1), // Para evitar cantidades negativas o 0
                  ]),
    })
  }

  ngOnInit(){
    this.obtenerProductos();
  }

  // Obtener productos
   
  obtenerProductos(){
    this.productosService.obtenerProductos().subscribe(
      (response)=>{
        this.productosListos = response.productos;
      }, (error)=>{
        console.log("Error al obtener los productos",error);
        
      }
    )
  }

    // ✅ Cargar datos en el modal al hacer clic en "Editar"
    seleccionarProducto(producto: any) {
      this.productoSeleccionado = producto;
      this.myForm.patchValue({
        nombre: producto.username, // Asegúrate de que "username" es el campo correcto
        precio: producto.precio,
        cantidad: producto.cantidad
      });
    }

  // Editar productos
  productoData: any[] = [];
  idListo: any[] = [];
  // ✅ Editar productos
  editarProducto() {
    if (this.myForm.valid && this.productoSeleccionado) {
      const datosActualizados = {
        username: this.myForm.value.nombre,
        precio: this.myForm.value.precio,
        cantidad: this.myForm.value.cantidad
      };

      this.productosService.editarProducto(this.productoSeleccionado._id, datosActualizados).subscribe(
        (response) => {
      Swal.fire({
        title: 'Actualizacion exitosa',
        text: '¡Has guardado el producto correctamente!',
        icon: 'success',
        showConfirmButton: true,
      }) 
          this.obtenerProductos(); // Recargar lista de productos
        },
        (error) => {
          console.log('Error al actualizar el producto:', error);
          alert('Error al actualizar el producto');
        }
      );
    }
  }

      // Validador para comprobar que no haya espacios en blanco
      private noWhitespaceValidator(
        control: FormControl
      ): { [key: string]: boolean } | null {
        if (control.value && control.value.trim().length === 0) {
          return { whitespace: true };
        }
        return null;
      }
}
