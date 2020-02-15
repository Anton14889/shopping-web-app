import { Component, OnInit } from '@angular/core';
import { CartService } from '../user-services/cart.service';
import { DataService } from '../services/data.service';
import { MatDialog } from '@angular/material/dialog';
import { ModalBuyComponent } from '../modal-buy/modal-buy.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(
    private _cartService: CartService,
    public dialog: MatDialog,
    private _data: DataService
  ) {}

  ngOnInit() {
    this. _data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer;
        if (this.user.cartSize) {
          this.allList()
        }
      });
  }

  user;
  result = []

  delete(data) {
    this._cartService.deleteItem(this.user.email, data.name);
    this.allList();
    this._data.updateCartSize()
  }

  buy(data) {
    this.dialog.open(ModalBuyComponent, {
      data: {
        name: data.name
      }
    });
  }

  private allList() {
    let result = [];
    const list = this._cartService.tableList(this.user.email)
      .subscribe(
        data => {
          if (data.empty) {
            return this.result = []
          }
          data.forEach(doc => {
            result.push(doc.data());
            this.result = result;
          })
        }, e => console.warn("tableList error")
      )
  }
}