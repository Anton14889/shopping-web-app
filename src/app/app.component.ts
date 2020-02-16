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
    private data: DataService,
    private auth: AuthService,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private ref: ChangeDetectorRef,
    private router: Router,
  ) { }


  ngOnInit() {
    this.auf();
  }

  auf() {
    this.afAuth.auth.onAuthStateChanged((user) => {
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
        this.ref.detectChanges();
        this.data.emitChange(this.user);
        this.data.updateCartSize();
        this.data.updateFavoritSize();

        this.afs.collection("admins").doc('eQbHkjgcwiGpCqwWHyzj').get().subscribe(
          data => {

            if (data.data()[this.user.email]) {
              this.auth.login(data.data()[this.user.email]);
              this.routAdminUser = 'admin';
              this.user.isAdmin = true;
              setTimeout(() => {
                // this.router.navigate(['admin'])
                this.router.navigate(['products'])
              }, 0);
              return
            }
            this.routAdminUser = 'user';
            this.router.navigate(['products'])
            return
          }
        )
      } else {
        console.log('НЕТ АУТЕНТИФИКАЦИИ')
        this.user = {
          email: null,
          isAdmin: false,
          favoritSize: null,
          cartSize: null
        };
        this.data.emitChange(this.user);
       
        this.routAdminUser = 'sign-in';
        this.router.navigate(['/'])
      }
    });
  }


  signOut() {
    this.afAuth.auth.signOut().then(_ => {
      console.log('signOut');
    }).catch(function (error) {
      console.log(error)
    });
  }


}
