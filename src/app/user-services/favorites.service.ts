import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { delay } from 'rxjs/operators';

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

    private _afs: AngularFirestore,
  ) { }

  tableList(userEmail) {
    return this._afs.collection("usersData")
    .doc(userEmail)
    .collection('favorites')
    .get().pipe(
      delay(500)
    )
   }

   addItem(userEmail: string, productName: string, objDescripton: DataDescripton) {
    
    this._afs.collection(`usersData`)
    .doc(`${userEmail}`)
    .collection('favorites')
    .doc(productName)
    .set(objDescripton)
    .then(() => {
      // alert("Document successfully written!");
    }).catch(e => alert('ERROR LOAD'))
  }

  deleteItem(userEmail: string, productName: string){
    this._afs.collection(`usersData`)
    .doc(`${userEmail}`)
    .collection('favorites')
    .doc(productName)
    .delete()
  }
}
