import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IngresoComponent } from './formularios/ingreso/ingreso.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistroComponent } from './formularios/registro/registro.component';
import { RouterModule } from '@angular/router';
import { PerfilUsuarioComponent } from './perfiles/perfil-usuario/perfil-usuario.component';
import { PerfilAdminComponent } from './perfiles/perfil-admin/perfil-admin.component';
import { AgregarEliminarComponent } from './funcionalidad/admin/agregar-eliminar/agregar-eliminar.component';
import { EditarComponent } from './funcionalidad/admin/editar/editar.component';
import { VerProductosComponent } from './funcionalidad/admin/ver-productos/ver-productos.component';
import { EditarPerfilComponent } from './funcionalidad/usuario/editar-perfil/editar-perfil.component';
import { ProductosComponent } from './funcionalidad/usuario/productos/productos.component';
import { HttpClientModule } from '@angular/common/http';
 



@NgModule({
  declarations: [
    IngresoComponent,
 
    RegistroComponent,
       PerfilUsuarioComponent,
       PerfilAdminComponent,
       AgregarEliminarComponent,
       EditarComponent,
       VerProductosComponent,
       EditarPerfilComponent,
       ProductosComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    HttpClientModule 
    
  ],
  exports: [
    RegistroComponent,
    IngresoComponent,
    PerfilAdminComponent,
    PerfilUsuarioComponent
  ]
})
export class FeaturesModule { }
