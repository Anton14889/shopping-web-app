import { ReplaySubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  data = {};

  private emitChangeSource = new ReplaySubject(null);

  changeEmitted$ = this.emitChangeSource.asObservable();

  emitUser(change: any) {
    this.data = change;
    this.emitChangeSource.next(this.data)
  }

  updateFavoritSize(change) {
    this.data['favoritSize'] = change;
    this.emitChangeSource.next(this.data)
  }
   
  updateCartSize(change) {
    this.data['cartSize'] = change;
    this.emitChangeSource.next(this.data)
  }
  
  emitAdminAddProduct() {
    this.data['adminAddProduct'] = true
  }





}
