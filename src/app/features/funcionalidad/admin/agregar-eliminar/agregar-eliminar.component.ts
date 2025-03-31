import { Component, OnInit } from '@angular/core';
import { FormControl, Validators,FormGroup } from '@angular/forms';
import { ProductosService } from '../../../../core/servicios/productos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-agregar-eliminar',
  standalone: false,
  templateUrl: './agregar-eliminar.component.html',
  styleUrl: './agregar-eliminar.component.css'
})
export class AgregarEliminarComponent implements OnInit {

  myForm:FormGroup;
  myFormEdit:FormGroup

  constructor(
    private productosService:ProductosService
  ){
    this.myForm = new FormGroup ({
            //NOMBRE DEL PRODUCTO
            username: new FormControl('', [
              Validators.required,
              this.noWhitespaceValidator,
            ]),
            //PRECIO DEL PRODUCTO
            precio: new FormControl('', [
              Validators.required,
              this.noWhitespaceValidator
              ]),
            ////CANTIDAD DEL PRODUCTO
            cantidad: new FormControl('', [
              Validators.required,
              this.noWhitespaceValidator,
            ]),
    }),

    this.myFormEdit = new FormGroup({
      //NOMBRE DEL PRODUCTO
                nombreEdit: new FormControl('', [
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

  ngOnInit() {
    this.obtenerProductos();
  }

  productoSeleccionado: any | null = null; // Producto que se va a editar
  productosListos: any[] = []; // Almacenar productos en un array
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


// Validador para comprobar que no haya espacios en blanco
private noWhitespaceValidator(
  control: FormControl
): { [key: string]: boolean } | null {
  const value = control.value;

  // Verificar que el valor sea un string antes de aplicar trim()
  if (typeof value === 'string' && value.trim().length === 0) {
    return { whitespace: true };
  }

  return null;
}

    //AGREGAR PRODUCTOS
    agregarProducto(){
      if(this.myForm.valid){

        this.productosService.agregarProducto(this.myForm.value).subscribe(
          (Response) =>{
            console.log(Response);
            console.log("PRODUCTO GUARDADO");
            this.obtenerProductos();
      Swal.fire({
        title: 'Registro Exitoso',
        text: '¡Has guardado el producto correctamente!',
        icon: 'success',
        showConfirmButton: true,
      }) 

          }
        )

      }else{
      Swal.fire({
        title: 'Error en el registro',
        text: '¡Faltan datos!',
        icon: 'error',
        showConfirmButton: true,
      });
      }
    }

    //ELIMINAR PRODUCTOS
    eliminarProductos(idProducto:string){
       
      this.productosService.eliminarProductos(idProducto).subscribe(
        (response)=>{
          console.log(response.message);
          this.productosListos = this.productosListos.filter(p => p._id !== idProducto);
        },
        (error) => {
          console.error("Error al eliminar producto:", error);
        }
      )
    }




        // ✅ Cargar datos en el modal al hacer clic en "Editar"
        seleccionarProducto(producto: any) {
          this.productoSeleccionado = producto;
          this.myFormEdit.patchValue({
            nombreEdit: producto.username, // Asegúrate de que "username" es el campo correcto
            precio: producto.precio,
            cantidad: producto.cantidad
          });
        }

  // Editar productos
  productoData: any[] = [];
  idListo: any[] = [];
  // ✅ Editar productos
  editarProducto() {
    if (this.myFormEdit.valid && this.productoSeleccionado) {
      const datosActualizados = {
        username: this.myFormEdit.value.nombreEdit,
        precio: this.myFormEdit.value.precio,
        cantidad: this.myFormEdit.value.cantidad
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

}
