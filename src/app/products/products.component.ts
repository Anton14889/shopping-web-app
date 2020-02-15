import { Component, OnInit } from '@angular/core';
import { UploadService } from '../upload-service/upload.service';
import { CartService } from '../user-services/cart.service';
import { DataService } from '../services/data.service';
import { Data } from '../services/data.model';
import { FavoritesService } from '../user-services/favorites.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  private result = [];
  searchArr = [];
  user: Data;

  constructor(
    private _uploadService: UploadService,
    private _cartService: CartService,
    private _favoritesService: FavoritesService,
    private _data: DataService
  ) {
    this._data.changeEmitted$.subscribe(
      (dataServer: Data) => {
        this.user = dataServer;
      })
    
  }

  ngOnInit() {
    this.allList()
  }

  addFavorites(data) {
    this._favoritesService.addItem(this.user.email, data.name, data);
    this._data.updateFavoritSize();
  }
  addCart(data) {
    this._cartService.addItem(this.user.email, data.name, data);
    this._data.updateCartSize();
  }

  searchByPrice(min, max) {
    let searchArr = [];

    if (max) {
      for (let i = 0; i < this.result.length; i++) {
        if (this.result[i].price >= min && this.result[i].price <= max) {
          searchArr.push(this.result[i])
        }
      }
      this.searchArr = searchArr
    } else {
      this.searchArr = this.result
    }
  }

  search(value) {
    let searchArr = [];

    if (value) {
      for (let i = 0; i < this.result.length; i++) {
        if (~this.result[i].name.indexOf(value)) {
          searchArr.push(this.result[i])
        }
      }
      this.searchArr = searchArr
    } else {
      this.searchArr = this.result
    }
  }

  private allList() {
    let result = [];
    let objData = {};

    this._uploadService.tableList()
      .subscribe(
        data => {

          data.forEach(doc => {

            this._uploadService.downloadImage(doc.data()['img'])
              .subscribe(
                imgURL => {
                  objData = doc.data();
                  objData['imgURL'] = imgURL;
                  result.push(objData)
                  this.result = result;
                  this.searchArr = result;
                },
                error => {
                  console.warn(error);
                  objData = doc.data();
                  objData['imageError'] = 'error';
                  result.push(objData)
                  this.result = result;
                  this.searchArr = result;
                }
              )
          })

        }, e => console.warn("tableList error")
      );
  }

}
