import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  // Método para guardar el token en el almacenamiento local
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Método para obtener el token desde el almacenamiento local
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Método para verificar si el usuario está autenticado
  /* este método sirve para verificar si el usuario está autenticado, 
  es decir, si ha iniciado sesión correctamente. */
  isAuthenticated(): boolean {
    const token = this.getToken();
    /* revisa si el token JWT existe en el almacenamiento local */
    return token !== null;
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
  }
  
}
