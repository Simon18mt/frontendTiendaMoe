import { Component, OnInit } from '@angular/core';
import { ProductosService } from '../../../../core/servicios/productos.service';
import { CarritoService } from '../../../../core/servicios/carrito.service';
import { TokenService } from '../../../../core/servicios/token.service';
import * as jwt from 'jwt-decode';
import { productoData } from '../../../../core/interface/productoData.interface';
import Swal from 'sweetalert2';
/* PARA USAR JSPDF */
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-productos',
  standalone: false,
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css'
})
export class ProductosComponent implements OnInit {

  

  idCarrito: string = '';
  idUser: string = '';
  productosCarritoListos: productoData[] = [];
  productosListos: productoData[] = [];
  tokenListo: any = null;
  tokenExpiration: Date | null = null;
  productoSeleccionado!: productoData;

  constructor (
    private productosService:ProductosService,
    private carritoService:CarritoService,
    private tokenService:TokenService
  ){}
  
  ngOnInit(){
    this.traerProductos();
    this.obtenerToken().then(() => {
      this.traerCarrito();   
    });
    
  }

  getTotalCarrito(): number {
    return this.productosCarritoListos.reduce((total, producto) => 
      total + (producto.precio * producto.cantidad), 0);
  }
  

 
  traerCarrito(){
    if(!this.idUser){
      console.error("ID de usuario no disponible.");
      return;
    }
  
    this.carritoService.obtenerCarrito(this.idUser).subscribe(
      (response)=>{
        // 🔹 Elimina duplicados basados en el ID del producto
        const productosUnicos = response.carrito.reduce((acc: productoData[], producto: productoData) => {
          if (!acc.some(p => p.username === producto.username && p.precio === producto.precio)) {
            acc.push(producto);
          }
          return acc;
        }, []);
  
        this.productosCarritoListos = productosUnicos;
        this.idCarrito = this.productosCarritoListos[0]?._id ?? "";
      },
      (error)=>{
        console.log(error);
      }
    );
  }
  
 
  traerProductos(){
    this.productosService.obtenerProductos().subscribe(
      (response)=>{
        this.productosListos = response.productos;
        // console.log("Productos obtenidos:", this.productosListos);
      },(error)=>{
        console.log(error);
        
      }
    )
  }

  /* ****************** SUMA ****************** */
  actualizarProducto() {
    if (!this.productoSeleccionado || !this.productoSeleccionado._id) {
      console.error("El producto seleccionado no tiene un ID válido.");
      return;
    }

    const datosActualizados: productoData = {
      _id: this.productoSeleccionado._id, 
      username: this.productoSeleccionado.username,
      precio: this.productoSeleccionado.precio,
      cantidad: this.productoSeleccionado.cantidad
    };

    this.carritoService.actualizarProducto(this.idUser, datosActualizados).subscribe(
      (response) => {
        console.log("Producto actualizado con éxito:", response);
        this.traerCarrito();
      },
      (error) => {
        console.error("Error al actualizar producto:", error);
      }
    );
  }

    /* ****************** RESTA ****************** */
    actualizarProductoResta() {
      if (!this.productoSeleccionado || !this.productoSeleccionado._id) {
        console.error("El producto seleccionado no tiene un ID válido.");
        return;
      }
  
      const datosActualizados: productoData = {
        _id: this.productoSeleccionado._id, 
        username: this.productoSeleccionado.username,
        precio: this.productoSeleccionado.precio,
        cantidad: this.productoSeleccionado.cantidad
      };
  
      this.carritoService.actualizarProducto(this.idUser, datosActualizados).subscribe(
        (response) => {
          console.log("Producto actualizado con éxito:", response);
          this.traerCarrito();
        },
        (error) => {
          console.error("Error al actualizar producto:", error);
        }
      );
    }


/* ********************** RESTAR ********************** */
restarProducto(producto: productoData) {
  if (!this.idUser) {
    console.error("ID de usuario no disponible.");
    return;
  }

  // Buscar si el producto ya está en el carrito
  const productoExistente = this.productosCarritoListos.find(p => p._id === producto._id);

  if (productoExistente) {
    // Si el producto ya existe, resta la cantidad
    const productoModificado: productoData = {
       
      ...productoExistente,
      cantidad: productoExistente.cantidad --, // Resta
    };

    console.log("Actualizando cantidad del producto en el carrito:", productoModificado);
    
    this.carritoService.actualizarProductoResta(this.idUser, productoModificado).subscribe(
      (response) => {
        // console.log("Cantidad del producto actualizada con éxito:", response);
        this.traerCarrito();
      },
      (error) => {
        console.error("Error al actualizar producto en el carrito:", error);
      }
    );

  } 
}

    

  
  /* ********************** SUMAR ********************** */
  agregarProductoAlCarrito(producto: productoData) {
    if (!this.idUser) {
      console.error("ID de usuario no disponible.");
      return;
    }
  
    // Buscar si el producto ya está en el carrito
    const productoExistente = this.productosCarritoListos.find(p => p._id === producto._id);
  
    if (productoExistente) {
      // Si el producto ya existe, aumentar la cantidad
      const productoModificado: productoData = {
        ...productoExistente,
        cantidad: productoExistente.cantidad + 1, // Aumentar en 1
      };
  
      console.log("Actualizando cantidad del producto en el carrito:", productoModificado);
      
      this.carritoService.actualizarProducto(this.idUser, productoModificado).subscribe(
        (response) => {
          console.log("Cantidad del producto actualizada con éxito:", response);
          this.traerCarrito();
        },
        (error) => {
          console.error("Error al actualizar producto en el carrito:", error);
        }
      );
  
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad = 1
      const nuevoProducto: productoData = {
        ...producto,
        cantidad: 1, // Se agrega con cantidad inicial 1
      };
  
      console.log("Añadiendo nuevo producto al carrito:", nuevoProducto);
      
      this.carritoService.agregarProducto(this.idUser, nuevoProducto).subscribe(
        (response) => {
          console.log("Producto agregado con éxito:", response);
          this.traerCarrito();
        },
        (error) => {
          console.error("Error al agregar producto al carrito:", error);
        }
      );
    }
  }


  agregarProductoAlCarritoMensage(producto: productoData) {

  
    Swal.fire({
      title: 'Se agrego el producto al carrito',
      text: '¡En el carrito podras aumentar la cantiadad de cada producto!',
      icon: 'success',
      showConfirmButton: true,
      });
    // Buscar si el producto ya está en el carrito
    const productoExistente = this.productosCarritoListos.find(p => p._id === producto._id);
  
    if (productoExistente) {
      // Si el producto ya existe, aumentar la cantidad
      const productoModificado: productoData = {
        ...productoExistente,
        cantidad: productoExistente.cantidad + 1, // Aumentar en 1
        
      };

      
      this.carritoService.actualizarProducto(this.idUser, productoModificado).subscribe(
        (response) => {
    
          this.traerCarrito();

        }
        
      );
  
    } else {
      // Si el producto no está en el carrito, agregarlo con cantidad = 1
      const nuevoProducto: productoData = {
        ...producto,
        cantidad: 1, // Se agrega con cantidad inicial 1
      };
  
      // console.log("Añadiendo nuevo producto al carrito:", nuevoProducto);
      
      this.carritoService.agregarProducto(this.idUser, nuevoProducto).subscribe(
        (response) => {
          console.log("Producto agregado con éxito:", response);
          this.traerCarrito();
        },
        (error) => {
          console.error("Error al agregar producto al carrito:", error);
        }
      );
    }
  }
  

  eliminarDelCarrito(){
    if (!this.idUser) {
      console.error("ID de usuario no disponible.");
      return;
    }
    if (!this.idCarrito) {
      console.error("productosCarritoListos de usuario no disponible.");
      return;
    }

    this.carritoService.eliminarCarrito(this.idUser, this.idCarrito ).subscribe(
      (response)=>{
        console.log("Producto eliminado con éxito:", response);
        this.traerCarrito();
      }
    )
  }
  

  /* *************************************************   */
 

  async obtenerToken(){
    const token = this.tokenService.getToken();

    if(token){
      this.tokenListo = this.decodeToken(token);
      // Asegura que el ID se almacene correctamente
      this.idUser = this.tokenListo?.user_id || ''; 
     
      
    }else{
      console.log("No hay token almacenado");
      
    }
  }

    decodeToken(token: string): any {
      try {
        if (!token || token.split('.').length !== 3) { 
          throw new Error('Token inválido: formato incorrecto');
        }
        const decoded = jwt.jwtDecode(token); 
        this.tokenExpiration = new Date(decoded.exp as number * 1000); 
  
        return decoded;
      } catch (error) {
        
      }
    }

    cerrarSesion(){
      this.tokenService.logout();
      console.log("TOKEN BORRADO");
      
    }


    generarFactura() {
      const doc = new jsPDF();
    
      // Agregar título
      doc.setFontSize(18);
      doc.text('Factura de Compra', 70, 10);
    
      // Definir columnas y filas
      const columnas = ['Producto', 'Precio', 'Cantidad', 'Subtotal'];
      const filas = this.productosCarritoListos.map(producto => [
        producto.username,
        `$${producto.precio}`,
        producto.cantidad,
        `$${(producto.precio * producto.cantidad).toFixed(2)}`
      ]);
    
      // Agregar tabla
      autoTable(doc, {
        head: [columnas],
        body: filas,
        startY: 20
      });
    
      // Agregar total
      doc.text(`Total: $${this.getTotalCarrito().toFixed(2)}`, 140, doc.internal.pageSize.height - 20);
    
      // Descargar PDF
      doc.save('factura.pdf');
    }

}
