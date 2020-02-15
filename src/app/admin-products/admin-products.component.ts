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
    private _authGuard: AuthGuard,
    private _appComponent: AppComponent
  ) { }

  ngOnInit() {
    this._authGuard.checkLogin('/sign-in')
  }
  signOut() {
    this._appComponent.signOut()
  }
}
