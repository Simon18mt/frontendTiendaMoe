import { Component } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// para este formulario usaremos “sweetalet2” 
import Swal from 'sweetalert2';
import { FormulariosService } from '../../../core/servicios/formularios.service';
import { TokenService } from '../../../core/servicios/token.service';
import * as jwt from 'jwt-decode';

@Component({
  selector: 'app-ingreso',
  standalone: false,
  templateUrl: './ingreso.component.html',
  styleUrl: './ingreso.component.css'
})
export class IngresoComponent {

  myForm : FormGroup;

  constructor(
    private tokenService:TokenService,
    private formulariosService:FormulariosService,
    private route:Router
  ){
    this.myForm = new FormGroup({
      /* encapsulamos cada campo con "FormControl"  */

      /* usaremos "noWhitespaceValidator" para no aceptar campos con espacios */

      //CORREO
      email: new FormControl('', [Validators.required, Validators.email]),
      //CONTRASEÑA
      password: new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
    

    })
  }
  /* ************************************ MANEJO DEL TOKEN ************************************ */

  tokenListo: any = null;
  tokenExpiration: Date | null = null;

  obtenerToken() {
    const token = this.tokenService.getToken();
    
    if (token) {
        /* console.log('Token obtenido:', token); 
        console.log("nombre"); */
         
      this.tokenListo = this.decodeToken(token);
  

    } else {
      console.log('No hay token en el almacenamiento local');
    }
  }

  decodeToken(token: string): any {
    try {
      if (!token || token.split('.').length !== 3) { 
        throw new Error('Token inválido: formato incorrecto');
      }

      
      // Decodificar el token con jwt_decode
       const decoded = jwt.jwtDecode(token); //La manera corecta 
      /* const decoded = jwt(token); */ // esta es la menera incorrecta
      /* console.log('Datos decodificados del token:', decoded); */

      // Convertir la fecha de expiración a milisegundos
      // EL error esta en **as number**
      this.tokenExpiration = new Date(decoded.exp as number * 1000); // CORRECTO
     /*  this.tokenExpiration = new Date(decoded.exp * 1000); */ // INCORRECTO 

      return decoded;
    } catch (error) {
      
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
 

    //Para enviar el formulario
    enviarFormulario(){
      //Vlidamos el formulario
      if(this.myForm.valid){

        this.formulariosService.loginService(this.myForm.value).subscribe(
          (response)=>{
            console.log("EL LOGIN ES CORRECTO");
            Swal.fire({
            title: 'ingreso Exitoso',
            text: '¡Te has registrado correctamente!',
            icon: 'success',
            showConfirmButton: true,
            }).then(()=>{

              // dirigir el login segun sea el *** userType ***
              if(response.token){
                this.tokenService.saveToken(response.token)
                //console.log("EL TOKEN",response.token);
                //Decodifica el token y devuelve un objeto con los datos que contiene el JWT
                this.tokenListo = jwt.jwtDecode(response.token);
                /* console.log(this.tokenListo.userType); */

                 if(this.tokenListo.userType == "admin"){
                  console.log("EL LOGIN ES DE UN ADMINISTRADOR");
                  this.route.navigate(['administrador'])
                 }

                 if(this.tokenListo.userType == "usuario"){
                  console.log("EL LOGIN ES DE UN USUARIO");
                  this.route.navigate(['usuario'])
                 }
                
                
              }
              //this.route.navigate(['usuario'])
            })
            this.myForm.reset()
          },(error)=>{
            console.log('Error de registro:', error);
            // Manejo de errores
            Swal.fire({
              title: 'Error al registrar los datos',
              text:
              error?.error?.message ||
              'Revise el formato del correo que este completo o la contraseña e intenta de nuevo.', 
              icon: 'error',
              showConfirmButton: true,
            })
          }
        )
      }else{
        console.log("ERORR EN EL FORMULARIO");
        Swal.fire({
          title: 'Error en el ingreso',
        text: '¡Error en los datos!',
        icon: 'error',
        showConfirmButton: true,
        })
      }
    }

    
}
