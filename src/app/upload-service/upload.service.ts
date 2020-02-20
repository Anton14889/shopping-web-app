import { Injectable } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
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
export class UploadService {

  constructor(
    private afStorage: AngularFireStorage,
    private afs: AngularFirestore,
    private snackBar: MatSnackBar,
  ) { }


  tableList() {
   return this.afs.collection("products").get().pipe(
     delay(500)
   )
  }

  deleteItem(productName: string){
    this.afs.collection('products').doc(productName).delete()
    .then(() => {
      this.snackBar.openFromComponent(ToastrComponent, {
        data: `${productName} deleted`
      });
    }).catch(e => alert('ERROR LOAD'))
  }

  deleteIMG(id){
    this.afStorage.ref(`/images/${id}`)
    .delete()
    .subscribe(
      res => {
        console.log('DELETED')
      }, error => {
        alert('ERROR delete image');
      }
    )
  }

  addItem(productName: string, objDescripton: DataDescripton) {
    this.afs.collection("products")
    .doc(productName)
    .set(objDescripton)
    .then(() => {
      this.snackBar.openFromComponent(ToastrComponent, {
        data: `${productName} added`
      });
    }).catch(e => {
      alert('ERROR LOAD');
    })
  }

  uploadImage(id, file) {
    this.afStorage.upload(`/images/${id}`, file)
  }

  downloadImage(id) {
    return this.afStorage.ref(`/images/${id}`).getDownloadURL().pipe(
      delay(800)
    )
  }

}
