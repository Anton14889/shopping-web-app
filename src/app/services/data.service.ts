import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { CartService } from '../user-services/cart.service';
import { FavoritesService } from '../user-services/favorites.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _cartService: CartService,
    private _favoritesService: FavoritesService
  ) { }
  data: any;

  private emitChangeSource = new ReplaySubject(null);

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(change: any) {
    this.emitChangeSource.next(change)
  }

  updateCartSize() {
    this.updateSize(this._cartService, 'cartSize')
  }

  updateFavoritSize() {
    this.updateSize(this._favoritesService, 'favoritSize')
  }

  private updateSize(service, sizeType) {
    this.emitChangeSource.subscribe(
      d => this.data = d
    ).unsubscribe();

    setTimeout(() => {
      service.tableList(this.data.email)
        .subscribe(
          data => {
            data.empty ? this.data[sizeType] = null : this.data[sizeType] = data.size;
            this.emitChange(this.data)
          }
        )
    }, 500);
  }




}
