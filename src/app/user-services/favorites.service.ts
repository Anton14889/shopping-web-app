import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { delay, flatMap } from 'rxjs/operators';

import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
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
    if (!userEmail) {
      let favoritObj = JSON.parse(localStorage.getItem('favorites')) || {};

      favoritObj[+productName] = true;
      localStorage.setItem('favorites', JSON.stringify(favoritObj));

      this.snackBar.openFromComponent(ToastrComponent, {
        data: `${objDescripton['name']} added to favorites`
      });

      this.data.updateFavoritSize(Object.keys(favoritObj).length);

      this.data.favoritId(+productName);
      return
    }

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
        alert('error add to cart');
      })
  }

  deleteItem(userEmail: string, productName: string, name: string) {

    if (!userEmail) {
      let favoritObj = JSON.parse(localStorage.getItem('favorites')) || {};

      delete favoritObj[productName];
      localStorage.setItem('favorites', JSON.stringify(favoritObj));

      this.snackBar.openFromComponent(ToastrComponent, {
        data: `${name} deleted from favorites`
      });

      this.data.deleteFavoritId(productName);
      if (Object.keys(favoritObj).length == 0) {
        this.data.updateFavoritSize(null);
        return
      }

      this.data.updateFavoritSize(Object.keys(favoritObj).length);
      return
    }

    this.afs.collection(`usersData`)
      .doc(`${userEmail}`)
      .collection('favorites')
      .doc(productName)
      .delete()
      .then(() => {
        this.snackBar.openFromComponent(ToastrComponent, {
          data: `${name} deleted from favorites`
        });
        this.favoritSize(userEmail);
        this.data.deleteFavoritId(productName);
      }).catch(e => {
        console.warn(e);
        alert('ERROR DELETE');
      })
  }

  favoritSize(userEmail) {

    if (!userEmail) {
      let favoritObj = JSON.parse(localStorage.getItem('favorites')) || {};

      for (const key in favoritObj) {
        if (favoritObj.hasOwnProperty(key)) {
          this.data.favoritId(+key)
        }
      }

      if (Object.keys(favoritObj).length == 0) {
        this.data.updateFavoritSize(null);
        return
      }

      this.data.updateFavoritSize(Object.keys(favoritObj).length);
      return
    }

    this.tableList(userEmail)
      .subscribe(
        data => {
          let size;
          data.empty ? size = null : size = data.size;
          this.data.updateFavoritSize(size)
          data.forEach(i => {
            this.data.favoritId(i['id'])
          })
        }
      )
  }
}
