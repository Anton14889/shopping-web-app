import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { AdminProductsComponent } from './admin-products/admin-products.component';
import { ProductsComponent } from './products/products.component';
import { FavoriteComponent } from './favorite/favorite.component';
import { CartComponent } from './cart/cart.component';


const routes: Routes = [
  {path: '',   redirectTo: '/sign-in', pathMatch: 'full'},
  { path: 'sign-in', component: SigninComponent },
  { path: 'sign-up', component: SignupComponent },
  { path: 'admin', component: AdminProductsComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'favorite', component: FavoriteComponent },
  { path: 'cart', component: CartComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
