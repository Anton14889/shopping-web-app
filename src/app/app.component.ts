import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';

import { DataService } from './services/data.service';
import { AngularFireAuth } from 'angularfire2/auth';

import { AngularFirestore } from '@angular/fire/firestore';

import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { Data } from './services/data.model';
import { CartService } from './user-services/cart.service';
import { FavoritesService } from './user-services/favorites.service';

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
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private ngZone: NgZone
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
        this.data.emitUser(this.user);
        this.cartService.cartSize(this.user.email)
        this.favoritesService.favoritSize(this.user.email)

        this.afs.collection("admins").doc('eQbHkjgcwiGpCqwWHyzj').get().subscribe(
          data => {

            if (data.data()[this.user.email]) {
              this.auth.login(data.data()[this.user.email]);
              this.routAdminUser = 'admin';
              this.user.isAdmin = true;
              setTimeout(() => {
                // this.navigate(['admin']);
                this.router.navigate(['products'])
              }, 0);
              return
            }
            this.routAdminUser = 'user';
            this.navigate(['products']);
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
        this.data.emitUser(this.user);

        this.routAdminUser = 'sign-in';
        this.navigate(['products']);
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

  public navigate(commands: any[]): void {
    this.ngZone.run(() => this.router.navigate(commands)).then();
  }

}
