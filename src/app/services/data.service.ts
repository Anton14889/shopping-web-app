import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { CartService } from '../user-services/cart.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private _cartService: CartService
  ) { }
  data: any;

  private emitChangeSource = new ReplaySubject(this.data);

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitChange(change: any) {
    this.emitChangeSource.next(change)
  }

  updateCartSize() {
    this.emitChangeSource.subscribe(
      d => this.data = d
    ).unsubscribe();
    const list = this._cartService.tableList(this.data.email)
      .subscribe(
        data => {
          data.empty ? this.data.cartItems = null : this.data.cartItems = data.size;
         
          this.emitChange(this.data)
        }
      )
  }



}
