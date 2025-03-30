import { Component, OnInit } from '@angular/core';
import { TokenService } from '../../../core/servicios/token.service';
import * as jwt from 'jwt-decode';

@Component({
  selector: 'app-perfil-admin',
  standalone: false,
  templateUrl: './perfil-admin.component.html',
  styleUrl: './perfil-admin.component.css'
})
export class PerfilAdminComponent implements OnInit {

  constructor (
    private tokenService:TokenService,
  ){}

  ngOnInit(){
    this.obtenerToken()
    
  }

  tokenListo: any = null;
  tokenExpiration: Date | null = null;

  obtenerToken(){
    const token = this.tokenService.getToken();

    if(token){
      this.tokenListo = this.decodeToken(token);
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
}
