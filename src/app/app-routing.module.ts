import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistroComponent } from './features/formularios/registro/registro.component';
import { HomeComponent } from './shared/home/home.component';
import { IngresoComponent } from './features/formularios/ingreso/ingreso.component';
import { PerfilAdminComponent } from './features/perfiles/perfil-admin/perfil-admin.component';
import { PerfilUsuarioComponent } from './features/perfiles/perfil-usuario/perfil-usuario.component';
 
import { AgregarEliminarComponent } from './features/funcionalidad/admin/agregar-eliminar/agregar-eliminar.component';
import { VerProductosComponent } from './features/funcionalidad/admin/ver-productos/ver-productos.component';
import { ProductosComponent } from './features/funcionalidad/usuario/productos/productos.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'registro',component:RegistroComponent},
  {path:'ingreso',component:IngresoComponent},
  /* PERFIL DEL ADMIN */
  {path: 'administrador',component:PerfilAdminComponent, 
    children:[
      {path:'agregar-eliminar',component:AgregarEliminarComponent},
       
      {path:'ver-productos',component:VerProductosComponent}
  ]},
  /* PERFIL DEL USUARIO */
  {path: 'usuario',component:PerfilUsuarioComponent,
    children:[
      {path:'productos',component:ProductosComponent}
    ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
