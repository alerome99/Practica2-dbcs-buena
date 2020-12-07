import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { AddNuevaComponent } from './add-nueva/add-nueva.component';

const routes: Routes = [
  {path: 'login', component:LoginComponent},
  //{path: 'login/:id/add', component:AddNuevaComponent},
  {path: 'add', component:AddNuevaComponent},
  {path: '**', redirectTo:'login',pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
