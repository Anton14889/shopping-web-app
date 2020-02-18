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

    this.afs.collection(`usersData`)
      .doc(`${userEmail}`)
      .collection('cart')
      .doc(productName)
      .set(objDescripton)
      .then(() => {
        this.snackBar.openFromComponent(ToastrComponent, {
          data: `${objDescripton['name']} added to cart`
        });
        this.cartSize(userEmail);
      }).catch(e => {
        console.warn(e)
        alert('ERROR LOAD')})
  }

  deleteItem(userEmail: string, productName: string, name: string) {
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
