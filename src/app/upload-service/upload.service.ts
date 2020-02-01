import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { delay, retry } from 'rxjs/operators';


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
    private _afStorage: AngularFireStorage,
    private _afs: AngularFirestore,
  ) { }


  tableList() {
   return this._afs.collection("products").get().pipe(
     delay(500)
   )
  }

  deleteItem(productName: string){
    this._afs.collection('products').doc(productName).delete()
  }

  deleteIMG(id){
    this._afStorage.ref(`/images/${id}`)
    .delete()
    .subscribe(
      res => {
        console.log('DELETED')
      }, error => alert('ERROR delete image')
    )
  }

  addItem(productName: string, objDescripton: DataDescripton) {
    this._afs.collection("products")
    .doc(productName)
    .set(objDescripton)
    .then(() => {
      // alert("Document successfully written!");
    }).catch(e => alert('ERROR LOAD'))
  }

  uploadImage(id, file) {
    this._afStorage.upload(`/images/${id}`, file)
  }

  downloadImage(id) {
    return this._afStorage.ref(`/images/${id}`).getDownloadURL()
  }

}
