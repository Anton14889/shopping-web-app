import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminProductsComponent } from '../admin-products/admin-products.component';
import { AuthGuard } from '../auth/auth.guard';


const routes: Routes = [
 {
  path: 'admin',
  component: AdminProductsComponent,
  canActivate: [AuthGuard]
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
