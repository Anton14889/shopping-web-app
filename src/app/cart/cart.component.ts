import { Component, OnInit, Inject } from '@angular/core';
import { CartService } from '../user-services/cart.service';
import { DataService } from '../services/data.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  constructor(
    private _cartService: CartService,
    public dialog: MatDialog,
    private _data: DataService
  ) {

    _data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer;
        this.allList()
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
    this.dialog.open(BuyDialog, {
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



@Component({
  template: `
  <h1 mat-dialog-title>
  
  Do you want to buy
  <br>
  {{data.name}} ?</h1>

<div mat-dialog-actions>
  <button mat-button (click)="onNoClick()">No</button>
  <button mat-button cdkFocusInitial>Buy</button>
</div>
`
})
export class BuyDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BuyDialog>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}