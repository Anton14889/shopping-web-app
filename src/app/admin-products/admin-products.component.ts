import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth/auth.guard';

@Component({
  selector: 'app-admin-products',
  templateUrl: './admin-products.component.html',
  styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {

  constructor(
    private _authGuard: AuthGuard
  ) { }

  ngOnInit() {
    this._authGuard.checkLogin('/sign-in')
  }

}
