import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { DataService } from './services/data.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface Item { name: string; }



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;
  user;
  constructor(

    private _data: DataService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private ref: ChangeDetectorRef,
    public router: Router

  ) {
    _data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer.email;
      });

    // this.itemsCollection = afs.collection<Item>('items');
    // this.items = this.itemsCollection.valueChanges();

  }


  ngOnInit() {

    this.afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user.email;
        this.ref.detectChanges();
        console.log(user);
        this.afs.collection("admins").doc('eQbHkjgcwiGpCqwWHyzj').get().subscribe(
          data => {
            if (data.data()[this.user]) {
                  return this.router.navigate(['admin']);
            }
          }
        )

      } else {
        console.log('НЕТ АУТЕНТИФИКАЦИИ')
      }

    });
  }


  // addItem(item: Item) {
  //   this.itemsCollection.add(item);
  // }


  isadmin() {
    this.afs.collection("admins").doc('eQbHkjgcwiGpCqwWHyzj').get().subscribe(
      data => {
        console.log(data.data());
        console.log(
          data.data()[this.user]

        );
      }
    )
    // console.log(this.user)
  }

  signOut() {
    this.afAuth.auth.signOut().then(_ => {
      console.log('signOut');
      this.user = '';
    }).catch(function (error) {
      console.log(error)
    });
  }
















  // registerForm =  new FormGroup({
  //   email: new FormControl('', Validators.required),
  //   password: new FormControl('',Validators.required)
  // })
  // errorMessage;
  // successMessage;

  // tryRegister(value){
  //   this.authService.SignUp(value)
  //   .then(res => {
  //     console.log(res);
  //     this.errorMessage = "";
  //     this.successMessage = "Your account has been created";
  //   }, err => {
  //     console.log(err);
  //     this.errorMessage = err.message;
  //     this.successMessage = "";
  //   })
  // }




}
