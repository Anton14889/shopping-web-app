import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { DataService } from './services/data.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Data } from './services/data.model';

export interface Item { name: string; }


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  items: Observable<Item[]>;

  user: Data = {
    email: null,
    isAdmin: null
  };

  routAdminUser = 'sign-in';
  constructor(
    private _data: DataService,
    private _auth: AuthService,
    private _afAuth: AngularFireAuth,
    private _afs: AngularFirestore,
    private _ref: ChangeDetectorRef,
    private _router: Router,
  ) { }


  ngOnInit() {
    this.auf();
  }

  auf() {
    this._afAuth.auth.onAuthStateChanged((user) => {
      if (user) {
        this.user.email = user.email;
        this.user.isAdmin = false;
        this.user.user = {
          displayName: user.displayName,
          photoURL: user.photoURL,
          email: user.email,
          emailVerified: user.emailVerified,
          phoneNumber: user.phoneNumber,
        }
        this._ref.detectChanges();
        this._data.emitChange(this.user);
        this._data.updateCartSize();
        this._data.updateFavoritSize();

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
            this.routAdminUser = 'user';
            this._router.navigate(['products'])
            return
          }
        )
      } else {
        console.log('НЕТ АУТЕНТИФИКАЦИИ')
        this.user = {
          email: null,
          isAdmin: false,
        };
        this._data.emitChange({
          favoritSize: null,
          cartSize: null
        });
        this.routAdminUser = 'sign-in';
        this._router.navigate(['/'])
      }
    });
  }


  signOut() {
    this._afAuth.auth.signOut().then(_ => {
      console.log('signOut');
    }).catch(function (error) {
      console.log(error)
    });
  }


}
