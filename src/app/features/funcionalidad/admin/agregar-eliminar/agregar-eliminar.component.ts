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
    }) 
  }

  ngOnInit() {
    this.obtenerProductos();
  }

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
      if (control.value && control.value.trim().length === 0) {
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

}
