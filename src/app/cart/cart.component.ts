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
    private cartService: CartService,
    public dialog: MatDialog,
    private data: DataService,
  ) { }

  ngOnInit() {
    this.data.changeEmitted$.subscribe(
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
    this.cartService.deleteItem(this.user.email, data.name);
    this.allList();
    this.data.updateCartSize()
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
    this.cartService.tableList(this.user.email)
      .subscribe(
        data => {
          if (data.empty) {
            return this.result.length = 0
          }
          data.forEach(doc => {
            result.push(doc.data());
            this.result = result;
          })
        }, e => console.warn("tableList error")
      )
  }
}