import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../core/servicios/token.service';
import * as jwt from 'jwt-decode';
import { ProductosService } from '../../../core/servicios/productos.service';

@Component({
  selector: 'app-perfil-usuario',
  standalone: false,
  templateUrl: './perfil-usuario.component.html',
  styleUrl: './perfil-usuario.component.css'
})
export class PerfilUsuarioComponent implements OnInit{
  constructor (
    private tokenService:TokenService,
    private productosService:ProductosService
  ){}

  ngOnInit(){

    this.obtenerToken();
 
    

  }

  trerProductos(){
    
  }

  tokenListo: any = null;
  tokenExpiration: Date | null = null;
  obtenerToken(){
    const token = this.tokenService.getToken();

    if(token){
      this.tokenListo = this.decodeToken(token)

    }else{
      console.log("NO HAY TOKEN");
      
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

    borraToken(){
      this.tokenService.logout();
    }

}
