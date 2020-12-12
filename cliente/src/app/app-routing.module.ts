import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AddNuevaComponent } from './add-nueva/add-nueva.component';
import { ConfiguracionListaComponent } from './configuracion-lista/configuracion-lista.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'configuraciones', component:ConfiguracionListaComponent},
  {path: 'configuraciones/:id/editar', component:AddNuevaComponent},
  {path: 'configuraciones/add', component:AddNuevaComponent},
  {path: '**', redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
