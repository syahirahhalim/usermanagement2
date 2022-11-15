import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./login/login.component";
import {UserListComponent} from "./user-list/user-list.component";
import {MapComponent} from "./map/map.component";

const routes: Routes = [
  {
    path: '',
    component: UserListComponent
  },
  {
    path: 'page/login',
    component: LoginComponent,
  },
  {
    path: 'page/maps',
    component: MapComponent,
  },
  {
    path: '**',
    redirectTo: '/',
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
