import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { delay, flatMap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material';
import { ToastrComponent } from '../toastr/toastr.component';
import { DataService } from '../services/data.service';

export interface DataDescripton {
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

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
        if (userEmail) {
          this.snackBar.openFromComponent(ToastrComponent, {
            data: `${objDescripton['name']} added to favorites`
          });
        }
        this.favoritSize(userEmail);
      }).catch(e => {
        console.warn(e);
        if (!userEmail) {
          alert('try register to add to favorites')
        } else {
          alert('error add to favorites')
        }
      })
  }

  deleteItem(userEmail: string, productName: string, name: string) {
    this.afs.collection(`usersData`)
      .doc(`${userEmail}`)
      .collection('favorites')
      .doc(productName)
      .delete()
      .then(() => {
        this.snackBar.openFromComponent(ToastrComponent, {
          data: `${name} deleted from favorites`
        });
        this.favoritSize(userEmail)
      }).catch(e => {
        console.warn(e)
        alert('ERROR DELETE');
      })
  }

  favoritSize(userEmail) {

    this.tableList(userEmail)
      .subscribe(
        data => {
          let size;
          data.empty ? size = null : size = data.size;
          this.data.updateFavoritSize(size)
        }
      )
  }
}
