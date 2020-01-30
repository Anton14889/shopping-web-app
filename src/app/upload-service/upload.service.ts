import { Injectable } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map, takeLast } from 'rxjs/operators';
import { from } from 'rxjs';

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

  result;


  editItem(productName: string, objDescripton: DataDescripton) {
    this._afs.collection("products")
      .doc(productName)
      .set(objDescripton)
      .then(() => {
        alert("Document successfully written!");
      }).catch(e => alert('ERROR LOAD'))
  }



  addItem(productName: string, objDescripton: DataDescripton) {
    this._afs.collection("products")
      .doc(productName)
      .set(objDescripton, { merge: true })
      .then(() => {
        alert("Document successfully written!");
      }).catch(e => alert('ERROR LOAD'))


  }

  tableList() {

    let result = [];
    let objData = {};

    this._afs.collection("products")
      .get().subscribe(
        data => {
          data.forEach(doc => {
            this.uniqueNames(doc.data()['name'])

            this.downloadImage(doc.data()['img']).subscribe(
              imgURL => {
                objData = doc.data();
                objData['imgURL'] = imgURL;
                result.push(objData);
               
                this.result = result;
              },
              error => {
                console.log(`ERROR load image id:  ${doc.data()['id']}`);

                objData = doc.data();
                result.push(objData);
                this.result = result
                // console.log(result);
              }
            )
          });
        });
  }

  uploadImage(id, file) {
    this._afStorage.upload(`/images/${id}`, file);
  }

  downloadImage(id) {
    return this._afStorage.ref(`/images/${id}`).getDownloadURL()
  }
  names = {};
  uniqueNames(name) {
    this.names[name] = true;

  }

}
