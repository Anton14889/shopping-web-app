import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UploadService } from '../upload-service/upload.service';
import { CartService } from '../user-services/cart.service';
import { DataService } from '../services/data.service';
import { Data } from '../services/data.model';
import { FavoritesService } from '../user-services/favorites.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  isOpen = true;
  mode = 'side';

  private result = [];
  searchArr = [];
  dataServer: Subscription;
  spinner = false;

  user: Data = {
    email: null
  };

  constructor(
    private uploadService: UploadService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private data: DataService,
    private favoritService: FavoritesService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 768px)');
    this._mobileQueryListener = () => {
      this.isOpen = !this.isOpen;
      this.mode === 'over' ? this.mode = 'side' : this.mode = 'over';
      changeDetectorRef.detectChanges();
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  id;

  ngOnInit() {
    if (document.documentElement.clientWidth <= 768) {
      this.isOpen = false;
      this.mode = 'over';
    }

    this.dataServer = this.data.changeEmitted$.subscribe(
      dataServer => {
        if (dataServer['email'] != this.user['email']) {
          this.user['email'] = dataServer['email'];
        }
        this.id = dataServer['favoritsId'];
      })

    this.allList()
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
    this.dataServer.unsubscribe()
  }

  addFavorites(data) {
    let favorites = {
      id: data.id,
      name: data.name
    };
    this.favoritesService.addItem(this.user.email, `${data.id}`, favorites);
  }
  deleteFavorites(data) {
    this.favoritService.deleteItem(this.user.email, `${data.id}`, data.name);
  }

  addCart(data) {
    let cart = {
      id: data.id,
      name: data.name
    };
    this.cartService.addItem(this.user.email, `${data.id}`, cart);
  }

  byMinPrice() {
    this.searchArr.sort(function (a, b) {
      return b.price - a.price
    })
  }
  byMaxPrice() {
    this.searchArr.sort(function (a, b) {
      return a.price - b.price
    })
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
        if (~this.result[i].name.trim().toLowerCase().indexOf(value.trim().toLowerCase())) {
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
    this.spinner = true;

    this.uploadService.tableList()
      .subscribe(
        data => {

          data.forEach(doc => {

            this.uploadService.downloadImage(doc.data()['img'])
              .subscribe(
                imgURL => {
                  objData = doc.data();
                  objData['imgURL'] = imgURL;
                  result.push(objData)
                  this.result = result;
                  this.searchArr = result;
                  this.spinner = false;
                },
                error => {
                  console.warn(error);
                  objData = doc.data();
                  objData['imageError'] = 'error';
                  result.push(objData)
                  this.result = result;
                  this.searchArr = result;
                  this.spinner = false;
                }
              )

          })



        }, e => console.warn("tableList error")
      )
  }




}