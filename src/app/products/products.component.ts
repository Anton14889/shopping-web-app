import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { UploadService } from '../upload-service/upload.service';
import { CartService } from '../user-services/cart.service';
import { DataService } from '../services/data.service';
import { Data } from '../services/data.model';
import { FavoritesService } from '../user-services/favorites.service';
import { MediaMatcher } from '@angular/cdk/layout';

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

  user: Data = {
    email: null
  };

  constructor(
    private uploadService: UploadService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private data: DataService,
    changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 576px)');
    this._mobileQueryListener = () => {
      this.isOpen = !this.isOpen;
      this.mode === 'over' ? this.mode = 'side' : this.mode = 'over';
      changeDetectorRef.detectChanges()
    };
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    if (document.documentElement.clientWidth <= 576) {
      this.isOpen = false;
      this.mode = 'over';
    }
    this.data.changeEmitted$.subscribe(
      (dataServer: Data) => {
        if (this.user.email != dataServer['email']) {
          this.user.email = dataServer.email;
          this.allList()
        }
      })
  }
  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  addFavorites(data) {
    this.favoritesService.addItem(this.user.email, data.name, data);
    this.data.updateFavoritSize();
  }
  addCart(data) {
    this.cartService.addItem(this.user.email, data.name, data);
    this.data.updateCartSize();
  }

  byMinPrice() {
    this.result.sort(function(a, b){
      return b.price - a.price
    })
  }
  byMaxPrice() {
    this.result.sort(function(a, b){
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
      )
  }

}
