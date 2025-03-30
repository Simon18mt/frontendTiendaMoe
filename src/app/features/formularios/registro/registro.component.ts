import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, Validators, FormGroup } from '@angular/forms';
// para este formulario usaremos “sweetalet2” 
import Swal from 'sweetalert2';
import { FormulariosService } from '../../../core/servicios/formularios.service';


@Component({
  selector: 'app-registro',
  standalone: false,
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {

    /* definimos el formulario con "FormGroup" */
    myForm: FormGroup;

  constructor (
    private formulariosService:FormulariosService,
    private router:Router
  ){
    this.myForm = new FormGroup({

      //NOMBRE
      username: new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      //CORREO
      email: new FormControl('', [Validators.required, Validators.email]),
      //CONTRASEÑA
      password: new FormControl('', [
        Validators.required,
        this.noWhitespaceValidator,
      ]),
      //ROL
      userType: new FormControl('',[Validators.required,])
    });
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


  enviar(){
    console.log("EL FORMULARIO ES CORRECTO");
    this.router.navigate(['administrador']); 
  }
  enviarFormulario(){

    //validamos que el formulario es correcto
    if(this.myForm.valid){

      this.formulariosService.registroService(this.myForm.value).subscribe(
        (response) =>{
            console.log("ENVIO EXITOSO");
      //manejo de la respuesta positiva
      Swal.fire({
        title: 'Registro Exitoso',
        text: '¡Te has registrado correctamente!',
        icon: 'success',
        showConfirmButton: true,
      }) 
      this.myForm.reset();
 
        }, (error) =>{
          console.log("ERROR EN EL ENVIO",error);
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
      console.log("ERROR EN EL FORMULARIO");
      Swal.fire({
        title: 'Error en el registro',
        text: '¡Faltan datos!',
        icon: 'error',
        showConfirmButton: true,
      });
      
    }
  }


}
