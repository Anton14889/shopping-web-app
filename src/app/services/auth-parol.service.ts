import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthWhithParolService {

  constructor(
    public afAuth: AngularFireAuth,
    public router: Router
  ) { }


//регистрация
  SignUp(email, password){
    return new Promise<any>((resolve, reject) => {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

  //вход
  SignIn(email, password) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(res => {
        resolve(res);
      }, err => reject(err))
    })
  }

   signOut() {
    this.afAuth.auth.signOut().then(function() {
      console.log('signOut')
    }).catch(function(error) {
      console.log(error)
    });
    return this.router.navigate(['/']);
  }
  

}
