import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  constructor(
    private authGuard: AuthGuard,
    private appComponent: AppComponent
  ) { }

  ngOnInit() {
    this.authGuard.checkLogin('/sign-in')
  }
  signOut() {
    this.appComponent.signOut()
  }
}
