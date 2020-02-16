import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { delay } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';
import { ToastrComponent } from '../toastr/toastr.component';

export interface DataDescripton {
  name: string;
  id: number;
  description: string;
  price: number;
  img: string;
}
@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(
    private snackBar: MatSnackBar,
    private afs: AngularFirestore,
  ) { }

  tableList(userEmail) {
    return this.afs.collection("usersData")
      .doc(userEmail)
      .collection('favorites')
      .get().pipe(
        delay(500)
      )
  }

  addItem(userEmail: string, productName: string, objDescripton: DataDescripton) {

    this.afs.collection(`usersData`)
      .doc(`${userEmail}`)
      .collection('favorites')
      .doc(productName)
      .set(objDescripton)
      .then(() => {
        this.snackBar.openFromComponent(ToastrComponent, {
          data: `${productName} added to favorites`
        });
      }).catch(e => alert('ERROR LOAD'))
  }

  deleteItem(userEmail: string, productName: string) {
    this.afs.collection(`usersData`)
      .doc(`${userEmail}`)
      .collection('favorites')
      .doc(productName)
      .delete()
      .then(() => {
        this.snackBar.openFromComponent(ToastrComponent, {
          data: `${productName} deleted from favorites`
        });
      }).catch(e => alert('ERROR LOAD'))
  }
}
