import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { DataService } from './services/data.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { CartService } from './user-services/cart.service';
import { Data } from './services/data.model';

export interface Item { name: string; }


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private itemsCollection: AngularFirestoreCollection<Item>;
  items: Observable<Item[]>;

  user: Data = {
    email: null,
    isAdmin: false
  };

  routAdminUser = 'sign-in';
  constructor(

    private _data: DataService,
    private _auth: AuthService,
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _ref: ChangeDetectorRef,
    private _router: Router,
    private _cartService: CartService,

  ) { }


  ngOnInit() {
    this.auf();
  }

  auf() {
    this._afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user.email = user.email;
        this.user.isAdmin = false;
        this._ref.detectChanges();
        this._data.emitChange(this.user);
        this._data.updateCartSize();

        this._afs.collection("admins").doc('eQbHkjgcwiGpCqwWHyzj').get().subscribe(
          data => {

            if (data.data()[this.user.email]) {
              this._auth.login(data.data()[this.user.email]);
              this.routAdminUser = 'admin';
              this.user.isAdmin = true;
              setTimeout(() => {
                this._router.navigate(['admin'])
              }, 0);
              return
            }
          }
        )
      } else {
        console.log('НЕТ АУТЕНТИФИКАЦИИ')
        this.routAdminUser = 'sign-in';
        this._router.navigate(['/'])
      }
    });
  }


  signOut() {
    this._afAuth.auth.signOut().then(_ => {
      console.log('signOut');
      this.user = {
        email: null,
        isAdmin: false
      };
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
