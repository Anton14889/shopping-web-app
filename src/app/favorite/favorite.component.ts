import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { FavoritesService } from '../user-services/favorites.service';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent {

  constructor(
    private _favoritService: FavoritesService,
    public dialog: MatDialog,
    private _data: DataService
  ) {

    _data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer;
        this.allList()
        setTimeout(() => {
          console.log(
            this.result
          )
        }, 3000);
      });
  }

  user;
  result = []

  delete(data) {
    this._favoritService.deleteItem(this.user.email, data.name);
    this.allList();
    this._data.updateCartSize()
  }

  buy(data) {
    this.dialog.open(BuyDialog1, {
      data: {
        name: data.name
      }
    });
  }

  private allList() {
    let result = [];
    const list = this._favoritService.tableList(this.user.email)
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
export class BuyDialog1 {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<BuyDialog1>,
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}