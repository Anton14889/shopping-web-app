import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from '../services/data.service';
import { FavoritesService } from '../user-services/favorites.service';
import { ModalBuyComponent } from '../modal-buy/modal-buy.component';

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrls: ['./favorite.component.css']
})
export class FavoriteComponent implements OnInit {

  constructor(
    private _favoritService: FavoritesService,
    public dialog: MatDialog,
    private _data: DataService
  ) { }
  ngOnInit() {
    this._data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer;
        if (this.user.favoritSize) {
          this.allList()
        }
      });
  }

  user;
  result = []

  delete(data) {
    this._favoritService.deleteItem(this.user.email, data.name);
    this.allList();
    this._data.updateFavoritSize()
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
    this._favoritService.tableList(this.user.email)
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
