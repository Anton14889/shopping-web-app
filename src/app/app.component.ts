import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { DataService } from './services/data.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask, AngularFireStorageReference } from 'angularfire2/storage';


import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

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

  routAdminUser = 'sign-in';
  constructor(

    private _data: DataService,
    private _auth: AuthService,
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _ref: ChangeDetectorRef,
    private _router: Router,
  
  ) {
    _data.changeEmitted$.subscribe(
      dataServer => {
        this.user = dataServer.email;
      });

    // this.itemsCollection = afs.collection<Item>('items');
    // this.items = this.itemsCollection.valueChanges();

  }


  ngOnInit() {

    this._afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user = user.email;
        this._ref.detectChanges();
        console.log(user);
        this._afs.collection("admins").doc('eQbHkjgcwiGpCqwWHyzj').get().subscribe(
          data => {

            if (data.data()[this.user]) {
              this._auth.login(data.data()[this.user]);
              this.routAdminUser = 'admin';
              
               this._router.navigate(['admin'])
               .then(
                 next => {
                 
                 }
               )
               
              // console.log(this._router.isActive('admin', false))
              // console.log(this._router.url)
              return
            }
          }
        )

      } else {
        console.log('НЕТ АУТЕНТИФИКАЦИИ')
      }

    });


  }



  isadmin() {
    this._afs.collection("admins").doc('eQbHkjgcwiGpCqwWHyzj').get().subscribe(
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
    this._afAuth.auth.signOut().then(_ => {
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
