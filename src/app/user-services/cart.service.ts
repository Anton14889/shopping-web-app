import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { delay, flatMap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';
import { ToastrComponent } from '../toastr/toastr.component';
import { DataService } from '../services/data.service';

export interface DataDescripton {
  id: number;
  name: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,
    private data: DataService,
  ) { }


  searchById(id) {
    return this.afs.collection('products', ref =>
      ref.where('id', '==', id)
        .limit(1))
      .snapshotChanges()
      .pipe(flatMap(clients => clients))

  }


  tableList(userEmail) {
    return this.afs.collection("usersData")
      .doc(userEmail)
      .collection('cart')
      .get().pipe(
        delay(500)
      )
  }

  addItem(userEmail: string, productName: string, objDescripton: DataDescripton) {

    if (!userEmail) {
      let cartObj = JSON.parse(localStorage.getItem('cart')) || {};
      cartObj[+productName] = true;
      localStorage.setItem('cart', JSON.stringify(cartObj));

      this.snackBar.openFromComponent(ToastrComponent, {
        data: `${objDescripton['name']} added to cart`
      });

      this.data.updateCartSize(Object.keys(cartObj).length);
      return
    }

    this.afs.collection(`usersData`)
      .doc(`${userEmail}`)
      .collection('cart')
      .doc(productName)
      .set(objDescripton)
      .then(() => {
        if (userEmail) {
          this.snackBar.openFromComponent(ToastrComponent, {
            data: `${objDescripton['name']} added to cart`
          });
        }
        this.cartSize(userEmail)
      }).catch(e => {
        console.warn(e);
        alert('error add to cart');
      })
  }

  deleteItem(userEmail: string, productName: string, name: string) {

    if (!userEmail) {
      let cartObj = JSON.parse(localStorage.getItem('cart')) || {};
      cartObj = JSON.parse(localStorage.getItem('cart'));
      delete cartObj[productName];
      localStorage.setItem('cart', JSON.stringify(cartObj));

      this.snackBar.openFromComponent(ToastrComponent, {
        data: `${name} deleted from cart`
      });

      if (Object.keys(cartObj).length == 0) {
        this.data.updateCartSize(null);
        return
      }

      this.data.updateCartSize(Object.keys(cartObj).length);
      return
    }

    this.afs.collection(`usersData`)
      .doc(`${userEmail}`)
      .collection('cart')
      .doc(productName)
      .delete()
      .then(() => {
        this.snackBar.openFromComponent(ToastrComponent, {
          data: `${name} deleted from cart`
        });
        this.cartSize(userEmail)
      }).catch(e => {
        console.warn(e)
        alert('ERROR DELETE')
      })
  }

  cartSize(userEmail) {
    if (!userEmail) {
      let cartObj = JSON.parse(localStorage.getItem('cart')) || {};
      cartObj = JSON.parse(localStorage.getItem('cart'));

      if (Object.keys(cartObj).length == 0) {
        this.data.updateCartSize(null);
        return
      }

      this.data.updateCartSize(Object.keys(cartObj).length);
      return
    }

    this.tableList(userEmail)
      .subscribe(
        data => {
          let size;
          data.empty ? size = null : size = data.size;
          this.data.updateCartSize(size)
        }
      )
  }

}
